import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./redux/store";
import AppRouter from "./router";
import ErrorHandler from "./containers/ErrorHandler/ErrorHandler";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorHandler>
          <AppRouter />
        </ErrorHandler>
      </PersistGate>
    </Provider>
  );
}
export default App;
