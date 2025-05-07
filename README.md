
# Credit Card Fraud Detection System

## Project Description

A web application for detecting fraudulent credit card transactions using Machine Learning models with Big Data scalability.

## Features
- Upload CSV files containing transaction data
- Analyze transactions for fraud detection
- View detailed risk analysis for each transaction
- Categorize transactions by risk level (High, Medium, Low)
- Visualize fraud probability distribution

## Dataset
[Hugging Face](https://huggingface.co/datasets/dazzle-nu/CIS435-CreditCardFraudDetection/tree/main)

## Website to test
[Fraud Shield](https://creditcardfraud.info/)


## Instrctions:
📝 Project Description
This project uses Apache Spark and MLlib to detect fraud in large-scale credit card transaction datasets. It tackles extreme class imbalance via upsampling (target fraud rate = 10.66%) and evaluates multiple models to choose the best one (Gradient Boosted Trees). The trained model is exported and served via a Flask API, backed by a clean frontend interface.

🚀 Features
📁 Upload CSV files for prediction

⚠️ Predict risk (fraud/not fraud) on real-time data

📊 Categorize transactions into High / Medium / Low risk

🧠 Model trained on:
Logistic Regression
Decision Tree
Gradient Boosted Trees (✅ Best)

Multilayer Perceptron (Neural Net)
📉 Evaluation: Accuracy, Precision, Recall, F1, ROC-AUC
🔁 SMOTE balancing: 10.66% fraud share

📂 Dataset
Source: HuggingFace
1,048,575 Transactions
Original fraud rate: ~0.57%
Upsampled fraud to 10.66%

🛠️ Tech Stack
Layer	Tools Used
Big Data	Apache Spark (PySpark)
Modeling	Spark MLlib, SMOTE
API	Flask
Frontend	React + Tailwind CSS (optional)
Visualization	Matplotlib, Pandas
Hosting	Colab, Flask, HuggingFace, Render

🧪 How to Run (Google Colab)
Open BigDataFinal_Spark.ipynb

Go to Runtime > Change runtime type
✅ Python 3
✅ High-RAM
❌ No GPU needed

