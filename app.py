
# ... keep existing code (import statements and configuration)

@app.route("/", methods=["GET", "HEAD", "OPTIONS"])
def health_check():
    # ... keep existing code (health check function)

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    # ... keep existing code (request handling and file check)

    try:
        df = pd.read_csv(file)
        logger.info(f"CSV shape: {df.shape}")
        logger.info(f"CSV columns: {df.columns.tolist()}")
        
        # Drop any unnamed numeric columns that are common in Excel-exported CSVs
        unnamed_cols = [col for col in df.columns if 'Unnamed' in str(col) or str(col).isdigit()]
        if unnamed_cols:
            logger.info(f"Dropping unnamed/numeric columns: {unnamed_cols}")
            df = df.drop(columns=unnamed_cols)
            
        # Log the first row for debugging
        logger.info(f"Sample data (first row): {df.iloc[0].to_dict()}")
    except Exception as e:
        logger.error(f"CSV read error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Invalid CSV format: {e}"}), 400

    try:
        # Attempt to map columns if needed
        df = map_columns(df)
        logger.info("Columns mapped successfully")
        logger.info(f"Mapped columns: {df.columns.tolist()}")
        logger.info(f"Sample mapped data: {df.iloc[0].to_dict()}")
        
        # Check if all model features are present
        missing_features = [feat for feat in model_features if feat not in df.columns]
        if missing_features:
            logger.error(f"Missing model features: {missing_features}")
            return jsonify({"error": f"Missing required columns: {missing_features}"}), 400
        
        X = df[model_features]
    except KeyError as e:
        logger.error(f"Missing model features: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Missing required columns: {e}"}), 400
    except Exception as e:
        logger.error(f"Error processing features: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Error processing data: {e}"}), 500

    try:
        # Get prediction probabilities
        df["fraud_probability"] = model.predict_proba(X)[:, 1]

        def classify(p):
            if p > 0.6: return "High"
            elif p > 0.3: return "Medium"
            return "Low"

        df["risk_level"] = df["fraud_probability"].apply(classify)
        
        logger.info(f"Prediction results: {df['fraud_probability'].describe()}")
        logger.info(f"Risk levels: {df['risk_level'].value_counts().to_dict()}")

        # Create enriched transaction info with all relevant fields
        def enrich_transaction(row):
            # Start with the original row data
            result = {}
            
            # Add key fields for identification
            result["trans_num"] = str(row.get("trans_num", "")) or str(row.get("id", ""))
            result["id"] = result["trans_num"]  # Ensure ID is set for frontend
            
            # Add transaction details
            result["cc_num"] = str(row.get("cc_num", ""))
            result["amt"] = float(row.get("amt", 0))
            result["amount"] = result["amt"]  # For frontend compatibility
            
            # Add date/time information
            result["unix_time"] = int(row.get("unix_time", 0))
            result["date"] = str(row.get("trans_date_trans_time", "")) 
            result["trans_date_trans_time"] = result["date"]
            
            # Add merchant and category data
            result["merchant"] = str(row.get("merchant", "Unknown"))
            result["category"] = str(row.get("category", ""))
            
            # Add risk assessment
            result["risk_level"] = row.get("risk_level", "Medium")
            result["fraud_probability"] = float(row.get("fraud_probability", 0.5))
            
            # Add personal data
            result["first"] = str(row.get("first", ""))
            result["last"] = str(row.get("last", ""))
            result["gender"] = str(row.get("gender", ""))
            
            # Return the complete transaction data
            return result

        def top_risk(df, level):
            risk_df = df[df["risk_level"] == level].sort_values("fraud_probability", ascending=False)
            if not risk_df.empty:
                transactions = risk_df.head(5).apply(enrich_transaction, axis=1).tolist()
                logger.info(f"{level} risk transactions: {len(transactions)}")
                return transactions
            return []

        # Get distribution and transactions by risk level
        high_risk = top_risk(df, "High")
        medium_risk = top_risk(df, "Medium") 
        low_risk = top_risk(df, "Low")
        
        output = {
            "riskDistribution": df["risk_level"].value_counts().to_dict(),
            "fraudProbabilities": df["fraud_probability"].round(2).tolist()[:8],
            "highRiskTransactions": high_risk,
            "mediumRiskTransactions": medium_risk,
            "lowRiskTransactions": low_risk
        }

        logger.info("Returning fraud prediction results")
        return jsonify(output)
    
    except Exception as e:
        logger.error(f"Error generating predictions: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Error generating predictions: {e}"}), 500

def map_columns(df):
    """Map columns from CSV to expected model features"""
    # Make a copy to avoid modifying the original
    df_copy = df.copy()
    
    # Log the columns we found in the input
    logger.info(f"Input columns before mapping: {df_copy.columns.tolist()}")
    
    # Define column mappings for common variations
    column_mappings = {
        # Standard columns that might be in the CSV
        "transaction_id": "trans_num",
        "transaction_date": "trans_date_trans_time",
        "credit_card": "cc_num",
        "amount": "amt",
        "merchant_name": "merchant",
        "merchant_category": "category",
        "timestamp": "unix_time"
    }
    
    # Apply mappings if needed
    for source, target in column_mappings.items():
        if source in df_copy.columns and target not in df_copy.columns:
            logger.info(f"Mapping column {source} to {target}")
            df_copy[target] = df_copy[source]
    
    # Drop any unnamed or numeric-only columns
    unnamed_cols = [col for col in df_copy.columns if 'Unnamed' in str(col) or (isinstance(col, str) and col.isdigit())]
    if unnamed_cols:
        logger.info(f"Dropping unnamed columns: {unnamed_cols}")
        df_copy = df_copy.drop(columns=unnamed_cols)
    
    # Check for numeric index column (common in Excel exports)
    if '6006' in df_copy.columns:
        logger.info("Found numeric index column '6006', dropping it")
        df_copy = df_copy.drop('6006', axis=1)
    
    # Handle special case for credit card numbers
    if "cc_num" in df_copy.columns:
        df_copy["cc_num"] = df_copy["cc_num"].astype(str).str.replace(r'[^\d]', '', regex=True)
        
    # Convert amount if needed
    if "amt" in df_copy.columns:
        # First convert to string, then remove any non-numeric except dots, then to float
        try:
            df_copy["amt"] = df_copy["amt"].astype(str).str.replace(r'[^\d.]', '', regex=True).astype(float)
        except:
            logger.warning("Could not convert amt column to float")
            df_copy["amt"] = pd.to_numeric(df_copy["amt"], errors='coerce').fillna(0)
    
    # Handle category columns - create one-hot encoding for categories
    if "category" in df_copy.columns:
        # Create category mapping
        categories = ['grocery', 'gas', 'entertainment', 'misc', 'health', 
                      'food', 'shopping', 'personal', 'home', 'kids', 
                      'travel', 'service']
        
        # Initialize all category columns with zeros
        for i in range(1, 14):
            column_name = f'category_{i}'
            if column_name not in df_copy.columns:
                df_copy[column_name] = 0
        
        # Map categories based on keywords in the category field
        for idx, row in df_copy.iterrows():
            category_text = str(row.get('category', '')).lower()
            
            # Default to category_1 (will be overridden if a match is found)
            df_copy.at[idx, 'category_1'] = 1
            
            # Set category based on keyword matching
            if 'grocery' in category_text:
                df_copy.at[idx, 'category_1'] = 1
            elif 'gas' in category_text or 'transport' in category_text:
                df_copy.at[idx, 'category_2'] = 1
                df_copy.at[idx, 'category_1'] = 0
            elif 'entertainment' in category_text:
                df_copy.at[idx, 'category_3'] = 1
                df_copy.at[idx, 'category_1'] = 0
            elif 'misc' in category_text:
                df_copy.at[idx, 'category_4'] = 1
                df_copy.at[idx, 'category_1'] = 0
            elif 'health' in category_text:
                df_copy.at[idx, 'category_5'] = 1
                df_copy.at[idx, 'category_1'] = 0
            elif 'food' in category_text or 'dining' in category_text:
                df_copy.at[idx, 'category_6'] = 1
                df_copy.at[idx, 'category_1'] = 0
            elif 'shopping' in category_text:
                df_copy.at[idx, 'category_7'] = 1
                df_copy.at[idx, 'category_1'] = 0
    
    # Handle gender - ensure gender_M is 0 or 1
    if "gender" in df_copy.columns and "gender_M" not in df_copy.columns:
        df_copy["gender_M"] = (df_copy["gender"].astype(str).str.upper() == "M").astype(int)
    
    # Handle state columns - create one-hot encoding
    if "state" in df_copy.columns:
        state_list = ['AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 
                     'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 
                     'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 
                     'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
                     'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
        
        state_upper = df_copy["state"].astype(str).str.upper()
        
        for state in state_list:
            state_col = f"state_{state}"
            if state_col not in df_copy.columns:
                df_copy[state_col] = (state_upper == state).astype(int)
    
    # Calculate or convert unix_time if missing
    if "unix_time" not in df_copy.columns and "trans_date_trans_time" in df_copy.columns:
        try:
            dates = pd.to_datetime(df_copy["trans_date_trans_time"], errors='coerce')
            df_copy["unix_time"] = dates.astype('int64') // 10**9
            
            # Extract date components for features
            if "transaction_hour" not in df_copy.columns:
                df_copy["transaction_hour"] = dates.dt.hour
            if "year" not in df_copy.columns:
                df_copy["year"] = dates.dt.year
            if "month" not in df_copy.columns:
                df_copy["month"] = dates.dt.month
            if "day" not in df_copy.columns:
                df_copy["day"] = dates.dt.day
            if "hour" not in df_copy.columns:
                df_copy["hour"] = dates.dt.hour
        except Exception as e:
            # Default to current time if parsing fails
            logger.warning(f"Could not parse transaction dates: {e}")
            df_copy["unix_time"] = int(pd.Timestamp.now().timestamp())
    
    # Add ID field if missing
    if "id" not in df_copy.columns:
        if "trans_num" in df_copy.columns:
            df_copy["id"] = df_copy["trans_num"]
        else:
            df_copy["id"] = [f"TX-{i}" for i in range(len(df_copy))]

    # Calculate age if missing
    if "age" not in df_copy.columns:
        if "dob" in df_copy.columns:
            # Try to calculate age from date of birth
            try:
                dob_dates = pd.to_datetime(df_copy["dob"], errors='coerce')
                current_year = pd.Timestamp.now().year
                df_copy["age"] = current_year - dob_dates.dt.year
            except:
                logger.warning("Could not calculate age from DOB")
                df_copy["age"] = 30  # Default age
        else:
            df_copy["age"] = 30  # Default age
    
    # Fill missing values for model features
    for col in model_features:
        if col not in df_copy.columns:
            logger.warning(f"Missing feature {col}, filling with zeros")
            df_copy[col] = 0
    
    return df_copy

# ... keep existing code (CORS handlers and main function)
