import { ScheduleProvider } from "./context/ScheduleProvider.jsx";
import Calendar from "./components/Calendar.jsx";
import Header from "./components/Header.jsx";
import PrintView from "./components/PrintView.jsx";

const App = () => {
  return (
    <ScheduleProvider>
      <div className="print:hidden">
        <Header />
        <Calendar />
      </div>
      <PrintView />
    </ScheduleProvider>
  );
};

export default App;
