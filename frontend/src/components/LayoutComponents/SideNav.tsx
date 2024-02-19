/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import { useForm } from "@mantine/form";
import { loadingCondition } from "../../utils/contants";
import deleteIcon from "../../assets/delete.png";
import { useState } from "react";
import Header from "./Header";

interface SpanData {
  span_length: number;
  load: number;
  loading_condition: loadingCondition;
}

interface SideNavInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDataFetched: (data: any) => void;
  setLoader: (value: boolean) => void;
}

export function SideNav({ setLoader, onDataFetched }: SideNavInterface) {
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      number_of_supports: 0,
      number_of_internal_joints: 0,
      span_data: [] as SpanData[],
      settlement_positions: [] as number[],
      settlement_values: [] as number[],
      settlement_on_beam: "no",
      first_node_fixed: "yes",
      last_node_fixed: "no",
    },
  });

  const onAddSpanClick = () => {
    form.setValues((prev) => ({
      ...prev,
      span_data: [
        ...(prev.span_data || []), // Ensure it's always an array
        { load: 0, span_length: 0, loading_condition: "P_C" },
      ],
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitClick = async (values: any) => {
    setLoader(true);
    setIsButtonLoading(true);
    try {
      console.log(values);
      const payload = {
        number_of_supports: !isNaN(parseInt(values.number_of_supports, 10)) ? parseInt(values.number_of_supports) : 0,
        number_of_internal_joints: !isNaN(parseInt(values.number_of_internal_joints, 10)) ? parseInt(values.number_of_internal_joints) : 0,
        span_data: values.span_data.map((_: any) => ({ load: parseInt(_.load), 'span_length': parseInt(_.span_length), 'loading_condition': _.loading_condition })),
        first_node_fixed: values.first_node_fixed,
        last_node_fixed: values.last_node_fixed,
        settlement_on_beam: values.settlement_on_beam,
        settlement_on_values: (values.settlement_on_values || []).map((_: any) => parseInt(_)),
        settlement_positions: (values.settlement_positions || []).map((_: any) => parseInt(_)),
      }
      const response = await fetch("http://127.0.0.1:5000/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(data);
      onDataFetched(data);
      setIsButtonLoading(false);
    } catch (e) {
      console.log(e);
      setIsButtonLoading(false);
    }
  };

  return (
    // <StyledNav>
    <div className="  items-center justify-center min-h-screen">
    <Header className="w-full" />
    <div className="text-white p-8 w-full max-w-md">
      <form onSubmit={form.onSubmit((values) => onSubmitClick(values))}>
                <div className="formContainer mb-4">
                    <label className="block text-sm mb-1">Number of Supports:</label>
                    <input
                        {...form.getInputProps("number_of_supports")}
                        type="number"
                        id="numSupports"
                        name="numSupports"
                        required
                        className="border border-white w-full text-lg h-9 rounded-lg bg-gray-800 text-white px-4"
                    />
                </div>

                <div className="formContainer mb-4">
                    <label className="block text-sm mb-1">Number of Internal Joints:</label>
                    <input
                        {...form.getInputProps("number_of_internal_joints")}
                        type="number"
                        id="numJoints"
                        name="numJoints"
                        required
                        className="border border-white w-full text-lg h-9 rounded-lg bg-gray-800 text-white px-4"
                    />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl">Beam Spans</h4>
                    <button type="button" className="bg-blue-600 border-none text-sm px-4 py-2 cursor-pointer rounded-lg"onClick={onAddSpanClick}>Add Span</button>
                </div>

                <div className="spanDetails">
                    <table className="border-separate border-spacing-10 mb-4">
                        <thead>
                            <tr>
                                <th className="tableHead">Span number</th>
                                <th className="tableHead">Length of span</th>
                                <th className="tableHead">Loading Condition</th>
                                <th className="tableHead">Magnitude</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {form.values.span_data.map((v, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <input
                                                placeholder="length of span"
                                                onChange={(v) => {
                                                    form.setFieldValue(`span_data.${i}.span_length`, v.target.value);
                                                }}
                                                value={v.span_length}
                                                type="number"
                                                className="border border-white w-[10rem] text-lg h-9 rounded-lg bg-gray-800 text-white px-4"
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={v.loading_condition}
                                                onChange={(v) => {
                                                    form.setFieldValue(`span_data.${i}.loading_condition`, v.target.value);
                                                }}
                                                className="border border-white w-[15rem] text-lg h-9 rounded-lg bg-gray-800 text-white"
                                            >
                                               <option value="none">None</option>
                                                <option value="P_C">Point load at center</option>
                                                <option value="P_X">
                                                    Point load at distance 'a' from left end and 'b' from the right end{" "}
                                                </option>
                                                <option value="P_C_2">
                                                    Two equal point loads, spaced at 1/3 of the total length from each other
                                                </option>
                                                <option value="P_C_3">
                                                    Three equal point loads, spaced at 1/4 of the total length from each other
                                                </option>
                                                <option value="UDL">Uniformly distributed load over the whole length</option>
                                                <option value="UDL/2_R">
                                                    Uniformly distributed load over half of the span on the right side{" "}
                                                </option>
                                                <option value="UDL/2_L">
                                                    Uniformly distributed load over half of the span on the left side
                                                </option>
                                                <option value="VDL_R">Variably distributed load, with highest point on the right end</option>
                                                <option value="VDL_L">Variably distributed load, with highest point on the left end </option>
                                                <option value="VDL_C">Variably distributed load, with highest point at the center</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                value={v.load}
                                                type="number"
                                                onChange={(v) => {
                                                    form.setFieldValue(`span_data.${i}.load`, v.target.value);
                                                }}
                                                className="border border-white w-full text-lg h-9 rounded-lg bg-gray-800 text-white px-4"
                                            />
                                        </td>
                                        <td>
                                          <button className="h-8 w-8 object-contain cursor-pointer bg-blue-500 rounded-xl"
                                                onClick={() => form.removeListItem("span_data", i)} >❌</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="formContainer mb-4">
                        <label className="block text-sm mb-1">Is First Node Fixed</label>
                        <select {...form.getInputProps("first_node_fixed")} className="border border-white w-full text-lg h-9 rounded-lg bg-gray-800 text-white px-4">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="formContainer mb-4">
                        <label className="block text-sm mb-1">Is Last Node Fixed</label>
                        <select {...form.getInputProps("last_node_fixed")} className="border border-white w-full text-lg h-9 rounded-lg bg-gray-800 text-white px-4">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                <button className="bg-blue-600 w-full h-12 text-lg border-none cursor-pointer rounded-lg">Solve</button>
                </form>
  </div>
</div>
   
  );
}