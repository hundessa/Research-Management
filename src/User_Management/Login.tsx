import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";



const Login: React.FC = () => {
    interface Values {
        email: string,
        password: string
    }

    const navigate = useNavigate();

    const handlesignIn = async (values: Values) => {
        try {
          const response = await axios.post(
            "http://localhost:4001/login",
            values
          );

          const { message, role } = response.data;

          if (message === "Login successful") {
            alert("Login successful");
            if (role === "researcher") {
              navigate("/");
            } else if (role === "dean") {
              navigate("/dean-dashboard");
            } else if (role === "coordinator") {
              navigate("/coordinator-dashboard");
            } else if (role === "reviewer") {
              navigate("/reviewer-dashboard");
            } else if (role === "directorate") {
              navigate("/directorate-dashboard");
            } else if (role === "finance") {
              navigate("/finance-dashboard");
            }
          } else if (
            message === "Incorrect password" ||
            message === "User not found"
          ) {
            alert("User or password not correct");
          }
        } catch (error) {
          alert("Error signing in");
          console.log("Error signing up", error);
        }

    }
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <div className="flex mx[100px] border-[1px] rounded-xl backdrop-blur-[17px]">
            <div className="space-y-4 px-[170px] py-[80px]">
              <div className="flex justify-center text-[var(--color)] mb-10">
                <h1 className="font-semibold text-4xl">Sign In</h1>
              </div>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validate={(values) => {
                  const errors: Partial<Values> = {};
                  if (!values.email) {
                    errors.email = "Required";
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = "Invalid email address";
                  }
                  if (!values.password) {
                    errors.password = "Required";
                  } else if (values.password.length < 6) {
                    errors.password = "Password must be at least 6 characters";
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  await handlesignIn(values); // Pass the form values to handlesignUp
                  setSubmitting(false);
                }}
              >
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="font-semibold text-xl text-[var(--color)]"
                    >
                      Email
                    </label>
                    <br />
                    <Field
                      id="email"
                      name="email"
                      placeholder="john@acme.com"
                      type="email"
                      className="pl-4 h-10 text-black/70 font-semibold bg-transparent border-b border-black focus:outline-none transition-all ease-in-out duration-500"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="font-semibold text-xl text-[var(--color)]"
                    >
                      Password
                    </label>
                    <br />
                    <Field
                      id="password"
                      name="password"
                      placeholder="*****"
                      type="password"
                      className="pl-4 h-10 text-black/70 font-semibold bg-transparent border-b border-black focus:outline-none transition-all ease-in-out duration-500"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm font-bold"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="my-6 bg-black/80 text-white/90 w-full px-6 py-2 cursor-pointer font-bold hover:bg-black hover:text-white transition-all ease-in-out duration-300"
                    >
                      Login
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </>
    );
}

export default Login;