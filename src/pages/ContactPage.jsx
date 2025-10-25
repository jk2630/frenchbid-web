import { useNavigate } from 'react-router-dom';

const ContactPage = () => {

    const navigate = useNavigate();
  // A placeholder handler for the form
  // In a real app, this would send the data to a backend or email service
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());
    console.log("Form Submitted:", formValues);

    // Reset the form
    event.target.reset();

    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    // Page container
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8">

      {/* Content container */}
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-2xl rounded-lg p-6 sm:p-10">

        {/* Header */}
        <div className="relative text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-300">
            Contact Us
          </h1>
          {/* Back link */}
          <button
            onClick={() => navigate(-1)} // This will go back to the previous page
            className="absolute top-0 left-0 text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
          >
            &larr; Go Back
          </button>
        </div>

        {/* --- Section: Get in Touch --- */}
        <section className="mb-8">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-content">
            Have a question, a bug report, or a suggestion? We'd love to hear from you.
            You can fill out the form below or send us an email directly.
          </p>
          <p className="section-content mt-4">
            <strong>Support Email:</strong>
            <a
              href="mailto:support@frenchbid.com"
              className="text-teal-400 hover:text-teal-300 ml-2"
            >
              support@frenchbid.com
            </a>
          </p>
        </section>

        {/* --- Section: Contact Form --- */}
        <section>
          <h2 className="section-title">Send a Message</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                placeholder="John Doe"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                placeholder="you@example.com"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                placeholder="Your message here..."
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="inline-block mt-4 px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-md text-lg font-medium text-white transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </form>
        </section>

      </div>
    </div>
  );
};

// --- CSS Classes ---
// Remember to add these to your 'index.css' file if you haven't!
/*
.section-title {
  @apply text-2xl sm:text-3xl font-semibold text-teal-300 border-b-2 border-teal-500 pb-2 mb-4;
}
.section-content {
  @apply text-base sm:text-lg leading-relaxed text-gray-300;
}
*/

export default ContactPage;
