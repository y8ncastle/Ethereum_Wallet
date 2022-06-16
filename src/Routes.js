import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PresentationLayout } from "./layout-blueprints";

const Main = lazy(() => import("./page/Main"));

const Routes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99,
    },
    in: {
      opacity: 1,
      scale: 1,
    },
    out: {
      opacity: 0,
      scale: 1.01,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  };

  return (
    <AnimatePresence>
      <Suspense
        fallback={
          <div className="d-flex align-items-center vh-100 justify-content-center text-center font-weight-bold font-size-lg py-3">
            <div className="w-50 mx-auto">지갑 화면을 불러오는 중입니다...</div>
          </div>
        }
      >
        <Switch>
          <Redirect exact from="/" to="/Main" />
          <Route path={["/Main"]}>
            <PresentationLayout>
              <Switch location={location} key={location.pathname}>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Route path="/Main" component={Main} />
                </motion.div>
              </Switch>
            </PresentationLayout>
          </Route>

          <Route path={["/Main"]}></Route>
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
};

export default Routes;
