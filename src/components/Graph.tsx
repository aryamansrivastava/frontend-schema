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

    let xRenderer = am5xy.AxisRendererX.new(root, {
      stroke: am5.color("#333"), 
      minGridDistance: window.innerWidth < 640 ? 20 : 50,
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.labels.template.setAll({
      fill: am5.color("#333"),
      fontSize: window.innerWidth < 640 ? 12 : 14,
      textAlign: "center",
    });

    xRenderer.grid.template.setAll({
      stroke: am5.color("#ddd"), 
      strokeOpacity: 0.5,
    });

    let yRenderer = am5xy.AxisRendererY.new(root, {
      stroke: am5.color("#333"),
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
      })
    );

    yRenderer.labels.template.setAll({
      fill: am5.color("#333"),
      fontSize: window.innerWidth < 640 ? 12 : 14,
    });

    yRenderer.grid.template.setAll({
      stroke: am5.color("#ddd"),
      strokeOpacity: 0.5,
    });

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Students",
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

  return <div id="studentChartDiv" className="h-80 w-full bg-white rounded-lg shadow-md p-4"></div>;
};

export default Graph;
