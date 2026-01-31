import { useState } from "react";
import { useAppContext } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";

const Auth = () => {
  const { login, register } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    rollnumber: "",
    hostel: "",
    roomnumber: "",
    admindepartment: "Hostel",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        if (formData.role === "Student") {
          payload.studentdetails = {
            rollnumber: formData.rollnumber,
            hostel: formData.hostel,
            roomnumber: formData.roomnumber,
          };
        } else if (formData.role === "Admin") {
          payload.admindepartment = formData.admindepartment;
        }

        const success = await register(payload);
        if (!success) setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Authentication failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">Full Name</label>
              <input
                name="name"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Register As:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">Super Admin</option>
                </select>
              </div>

              {formData.role === "Student" && (
                <div className="space-y-3 animate-fadeIn">
                  <input
                    name="rollnumber"
                    placeholder="Roll Number"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      name="hostel"
                      placeholder="Hostel Name"
                      className="w-1/2 p-2 border rounded"
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="roomnumber"
                      placeholder="Room No"
                      className="w-1/2 p-2 border rounded"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {formData.role === "Admin" && (
                <div className="animate-fadeIn">
                  <label className="block text-xs text-gray-500 mb-1">Department</label>
                  <select
                    name="admindepartment"
                    className="w-full p-2 border rounded bg-white"
                    onChange={handleChange}
                    value={formData.admindepartment}
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="Mess">Mess</option>
                    <option value="Academic">Academic</option>
                    <option value="Internet / Network">Internet / Network</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-gray-500 pt-2">
            {isLogin ? "Create an account? " : "Already have account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-bold hover:underline"
            >
              click here
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 mt-4"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;