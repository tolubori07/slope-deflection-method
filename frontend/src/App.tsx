import "./App.css";
import { SideNav } from "./components/LayoutComponents/SideNav";
//import { LoadingWrapper } from "./components/LoadingWrapper";
import { useState } from "react";
import { DrawingBox } from "./components/LayoutComponents/DrawingBox";

function App() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState();

  return (
<>
      <div className=" bg-gray-900 w-[100%]">
  <div className="w-96 h-full">
    <SideNav
      setLoader={(v) => setLoading(v)}
      onDataFetched={(data) => {
        setData(data);
        setLoading(false);
      }}
    />
  </div>
  {/* <div className="flex-1 w-600">
    <LoadingWrapper isLoading={isLoading}>
    </LoadingWrapper>
  </div> */}
  
</div>
<DrawingBox data={data} />
   </>
  );
}

export default App;
