
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} Credit Card Fraud Detection. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
