const Alert = ({ variant = 'destructive', children }) => {
    const variants = {
      destructive: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
      success: "bg-green-50 border-green-200 text-green-800"
    };
  
    return (
      <div className={`
        w-full max-w-2xl mt-6 p-4 
        border rounded-lg shadow-sm
        transition-all duration-300 ease-in-out
        ${variants[variant]}
      `}>
        {children}
      </div>
    );
  };
  
  export default Alert;