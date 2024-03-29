import React, { useContext, useEffect } from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { handleSubmit } from "../utils/Fns";
import { apiCall } from "../Services/ApiCall";
import { adminLoginUrl } from "../Services/baseUrl";
import { ContextDatas } from "../Services/Context";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { Show_Toast } from "../utils/Toast";

function LoginPage() {
  const [validated, setValidated] = useState(false);
  const { user, setUser } = useContext(ContextDatas);

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const login = async () => {
    try {
      const response = await apiCall("post", adminLoginUrl, data);

      const token = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      setUser(jwtDecode(token));

      Show_Toast("Login Successfull", true);

      window.location.href = "/customer";
    } catch (error) {
      console.error("Login failed:", error);

      Show_Toast("Login failed. Please check your credentials and try again.");
    }
  };

  useEffect(() => {
    if (user) {
      window.location.href = "/customer";
    }
  }, [user]);

  return (
    <>
      <div className="login-page">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <div className="text-center mb-3">
                        <a href="index.html"></a>
                      </div>
                      <h4 className="text-center mb-4">Sign in your account</h4>
                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={(e) => handleSubmit(e, setValidated, login)}
                      >
                        <Form.Group as={Col} controlId="validationCustom01">
                          <Form.Label className="mb-1">Username</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Enter username"
                              value={data.username}
                              onChange={(e) =>
                                setData({ ...data, username: e.target.value })
                              }
                              aria-describedby="inputGroupPrepend"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter Username.
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          as={Col}
                          controlId="validationCustom02"
                        >
                          <Form.Label className="mb-1 mt-4">
                            Password
                          </Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              required
                              type="password"
                              placeholder="Enter password"
                              value={data.password}
                              onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                              }
                              aria-describedby="inputGroupPrepend"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please check your password.
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                        <div className="text-center mt-4">
                          <Button
                            type="submit"
                            className="btn btn-primary btn-block"
                          >
                            Sign in
                          </Button>
                        </div>
                      </Form>
                      {/* <div className="new-account mt-3">
                <p>Already have an account? <a className="text-primary" href="page-login.html">Sign in</a></p>
              </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
