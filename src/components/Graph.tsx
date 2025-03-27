import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface GraphProps {
  chartData: { category: string; value: number }[];
}

const Graph: React.FC<GraphProps> = ({ chartData }) => {
  useEffect(() => {
    let root = am5.Root.new("studentChartDiv");
    root.setThemes([am5themes_Animated.new(root)]);
    root?._logo?.dispose(); 

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
      })
    );

    const values = chartData.map((item) => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const yMin = 0; 
    const yMax = maxValue + (maxValue - minValue) * 0.2; 

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: window.innerWidth < 640 ? 30 : 60,
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.labels.template.setAll({
      fontSize: 14,
      textAlign: "center",
    });

    let yRenderer = am5xy.AxisRendererY.new(root, {});
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
        min: yMin,
        max: yMax,
        strictMinMax: true, 
        extraMax: 0.1, 
      })
    );

    yRenderer.labels.template.setAll({
      fontSize: 14,
    });

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" }),
      })
    );

    xAxis.data.setAll(chartData);
    series.data.setAll(chartData);

    series.columns.template.setAll({
      stroke: am5.color("#3498db"), 
      strokeWidth: 2,
      fill: am5.color("#3498db"), 
      fillOpacity: 0.8,
      cornerRadiusTL: 8,
      cornerRadiusTR: 8,
    });

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartData]);

  return <div id="studentChartDiv" className="h-80 w-full bg-white rounded-lg p-4"></div>;
};

export default Graph;
