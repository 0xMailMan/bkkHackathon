import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Toaster } from "./components/ui/toaster";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Stream from "./pages/Stream";
import Schedule from "./pages/Schedule";
import Explore from "./pages/Explore";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/stream/:id" component={Stream} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/explore" component={Explore} />
          <Route>404 Page Not Found</Route>
        </Switch>
      </Layout>
      <Toaster />
    </SWRConfig>
  </StrictMode>,
);
