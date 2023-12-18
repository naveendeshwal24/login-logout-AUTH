import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import RegistrationForm from "./RegistrationForm";
import MasterList from "./MasterList";
import EditList from "./EditList";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import LandingPage from "./LandingPage";
import ResetPassword from "./ResetPassword";
import ThreeDComponent from "./ThreeDComponent";

const CustomRoutes = () => {
  const routesForAuthenticatedOnly = {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/EditList",
        element: <EditList />,
      },
    ],
  };

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <LandingPage />, //route for testing purpose
    },
    {
      path: "/LandingPage",
      element: <LandingPage />, //route for testing purpose
    },
    {
      path: "/LogIn",
      element: <LogIn />,
    },
    {
      path: "/reset_password",
      element: <ResetPassword />,
    },
    {
      path: "/ResetPassword",
      element: <ResetPassword />,
    },
    {
      path: "/SignUp",
      element: <SignUp />,
    },
    {
      path: "/RegistrationForm",
      element: <RegistrationForm />,
    },
    {
      path: "/ForgotPassword",
      element: <ForgotPassword />,
    },
    {
      path: "/MasterList",
      element: <MasterList />,
    },
    {
      path: "/ThreeDComponent",
      element: <ThreeDComponent />,
    },
  ];

  const { token } = useAuth();

  // const token1 = localStorage.getItem("token");

  // console.log("token-test", token1);
  console.log("token-test", token);

  // Combine and conditionally include routes based on authentication status
  const routes = token
    ? [routesForAuthenticatedOnly]
    : routesForNotAuthenticatedOnly;

  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children &&
              route.children.map((childRoute) => (
                <Route
                  key={childRoute.path}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
          </Route>
        ))}
      </Routes>
    </Router>
  );
};

export default CustomRoutes;
