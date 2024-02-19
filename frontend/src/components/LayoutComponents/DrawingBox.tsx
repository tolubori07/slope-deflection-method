/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, ReferenceLine } from "recharts";

interface DrawingBoxInterface {
  data: any;
}

export const DrawingBox = ({ data }: DrawingBoxInterface) => {
  const [shearForcesChartValue, setShearForceChartValue] = useState<null | { name: string; ShearForce: any }[]>(null);

  useEffect(() => {
    if (data && data.shear_forces !== undefined) {
      const payload = data.shear_forces.map((value: string, index: any) => ({
        name: `Point ${index}`,
        ShearForce: parseFloat(value),
      }));

      setShearForceChartValue(payload);
    }
  }, [data]);
  return (

      <div>
    {data !== undefined && (
        <div className="momentDiv bg-gray-900 text-white p-4 rounded-lg">
            <h4 className="text-lg mb-4">Fixed End Moments</h4>
            <table className="w-full">
                <thead>
                    <tr className="bg-[#1E88EB]">
                        {data["equationSolution"] !== undefined &&
                            Object.entries(data.equationSolution).map(([key]) => <td key={key} className="text-white py-2">{key}</td>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {data["equationSolution"] !== undefined &&
                            Object.entries(data.equationSolution).map(([key, value]) => (
                                <td key={key} className="text-center py-2">{Number(value as any).toFixed(2)}</td>
                            ))}
                    </tr>
                </tbody>
            </table>
            <br />
            <h4 className="text-lg mb-4">Shear Force Diagram</h4>
            <div className="shearForce">
                {shearForcesChartValue !== null && (
                    <LineChart
                        width={700}
                        height={400}
                        data={shearForcesChartValue}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="linear" dataKey="ShearForce" stroke="red" activeDot={{ r: 8 }} />
                        <ReferenceLine y={0} stroke="black" strokeDasharray="5 5" />

                        <Area type="linear" dataKey="ShearForce" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </LineChart>
                )}
            </div>
        </div>
    )}
</div>


  );
};



