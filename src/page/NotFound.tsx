import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-blue-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="p-8 text-center">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 animate-scaleIn">
              404
            </h1>
            <h2 className="text-4xl font-semibold text-gray-800 mt-4 mb-6 animate-slideUp">
              صفحه مورد نظر یافت نشد
            </h2>
            <p className="text-xl text-gray-600 mb-8 animate-slideUp">
              متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری
              منتقل شده است.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                بازگشت به خانه
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                تماس با ما
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
