import { Input } from "antd";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [field, setField] = useState(4);
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);

  const generateHeaders = () => {
    let headers = ["保險年度", "保險年齡"];
    for (let i = 1; i <= field - 3; i++) {
      headers.push(`保費${i}`);
    }
    headers.push("保費合計");
    return headers;
  };

  const calculateColumnSums = () => {
    const sums = Array(field).fill(0);
    data.forEach((row) => {
      for (let i = 2; i < row.length; i++) {
        sums[i] = (sums[i] || 0) + (parseInt(row[i].replace(/,/g, "")) || 0);
      }
    });
    return sums;
  };

  useEffect(() => {
    let inputList = input
      .trim()
      .split(" ")
      .filter((w) => w !== "");

    let rows = [];

    while (inputList.length && field > 0) {
      rows.push(inputList.splice(0, field));
    }

    setData(rows);
  }, [input, field, setData]);

  const columnSums = calculateColumnSums();

  return (
    <div className="App">
      <div>
        總共有幾欄：
        <Input
          placeholder="欄數"
          defaultValue={4}
          type="number"
          min={4}
          onChange={(e) => setField(e.target.value)}
        />
        複製的資料：
        <Input
          placeholder="請貼上複製的資料"
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div style={{ padding: "10px", textAlign: "center" }}>
        <table border={"1 dashed"}>
          <thead>
            <tr>
              {generateHeaders().map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={2} style={{ color: "red" }}>
                總和
              </td>
              {columnSums.slice(2, field).map((sum, index) => (
                <td style={{ color: "red" }} key={index}>
                  {sum.toLocaleString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
