function Footer() {
    return (
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} StoryLens. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm">
              Contact us:{" "}
              <a
                href="mailto:bhargavdash@gmail.com"
                className="text-teal-500 hover:text-teal-600 transition-colors"
              >
                bhargavdash@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  