
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "./auth/AuthContext";
import ReactECharts from "echarts-for-react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Cpu,
  Database,
  Download,
  FileBarChart,
  Gauge,
  LayoutDashboard,
  Menu,
  Microscope,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
  Zap,
  Layers3,
  Layers,
  LogOut,
  X,
} from "lucide-react";
import "./index.css";
import { api, type User, type AuditLog } from "./api/api";

/* --------------------------------------------------
   NAVIGATION
-------------------------------------------------- */

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Executive Overview", icon: LayoutDashboard },
    ],
  },
  {
    title: "FLEET & ASSETS",
    items: [
      { name: "Elevator Fleet Registry", icon: Building2 },
      { name: "Live Sensor Intelligence", icon: Activity },
      { name: "Device & Hardware", icon: Cpu },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { name: "AI Prediction & Diagnosis", icon: Zap },
      { name: "Prediction Validation", icon: ClipboardCheck },
      { name: "Investigation Laboratory", icon: Microscope },
      { name: "Cross-Elevator Intelligence", icon: Layers3 },
      { name: "Model Operations", icon: Database },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { name: "Complaint & Compliance", icon: ShieldCheck },
      { name: "Maintenance Engineering", icon: Wrench },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Reports & Analytics", icon: FileBarChart },
      { name: "Security & Administration", icon: Settings },
    ],
  },
];

const sectionDescriptions: Record<string, string> = {
  "Elevator Fleet Registry":
    "Review registered elevators, building information, equipment profiles and service history.",
  "Live Sensor Intelligence":
    "Inspect telemetry streams, sensor quality, operating patterns and equipment signals.",
  "Device & Hardware":
    "Monitor edge devices, sensor inventory, connectivity and firmware status.",
  "AI Prediction & Diagnosis":
    "Review model-generated fault predictions, evidence and recommended investigations.",
  "Prediction Validation":
    "Evaluate predictions against engineer-confirmed outcomes and maintain validation records.",
  "Investigation Laboratory":
    "Replay historical events and inspect synchronized sensor evidence.",
  "Cross-Elevator Intelligence":
    "Compare equipment behaviour across buildings, models and regions.",
  "Model Operations":
    "Review model versions, evaluation results, drift and deployment status.",
  "Complaint & Compliance":
    "Review customer complaints, compliance records and linked technical evidence.",
  "Maintenance Engineering":
    "Track engineering work orders, assignments, repairs and follow-up actions.",
  "Reports & Analytics":
    "Explore fleet performance, incidents, maintenance trends and downloadable reports.",
  "Security & Administration":
    "Manage users, permissions, access policies and audit records.",
};

/* --------------------------------------------------
   HEADER
-------------------------------------------------- */

function Header({ active }: { active: string }) {
  const { user, logout } = useAuth();

  const initials = user?.full_name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Technical Operations</span>
        <ChevronRight size={14} />
        <strong>{active}</strong>
      </div>

      <div className="top-actions">
        <div className="environment">
          <span />
          DEMO ENVIRONMENT
        </div>

        <button className="icon-button" aria-label="Search">
          <Search size={18} />
        </button>

        <button className="icon-button notification" aria-label="Notifications">
          <Bell size={18} />
          <i />
        </button>

        <div className="user-profile">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <strong>{user?.full_name || "User"}</strong>
            <span>{user?.role || "Viewer"}</span>
          </div>
          <button
            className="logout-button"
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------------------------
   EXECUTIVE OVERVIEW
-------------------------------------------------- */

const metrics = [
  {
    label: "Total elevators",
    value: "2,486",
    note: "Across registered sites",
    icon: Building2,
    color: "blue",
  },
  {
    label: "Operating normally",
    value: "2,391",
    note: "96.2% of registered fleet",
    icon: CheckCircle2,
    color: "green",
  },
  {
    label: "Active incidents",
    value: "18",
    note: "4 require immediate review",
    icon: AlertTriangle,
    color: "amber",
  },
  {
    label: "Pending validation",
    value: "32",
    note: "Awaiting engineer review",
    icon: ClipboardCheck,
    color: "purple",
  },
];

const incidents = [
  {
    id: "INC-24081",
    site: "Orchid Business Park",
    elevator: "KNE-04-218",
    issue: "Door operation irregularity",
    severity: "High",
    age: "12 min",
  },
  {
    id: "INC-24080",
    site: "Meridian Towers",
    elevator: "KNE-02-091",
    issue: "Vibration above baseline",
    severity: "Medium",
    age: "38 min",
  },
  {
    id: "INC-24079",
    site: "Northgate Centre",
    elevator: "KNE-01-443",
    issue: "Intermittent sensor signal",
    severity: "Medium",
    age: "1 hr",
  },
  {
    id: "INC-24078",
    site: "Lakeview Residences",
    elevator: "KNE-03-117",
    issue: "Motor temperature deviation",
    severity: "Low",
    age: "2 hr",
  },
];

function Overview() {
  const trendOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 38, right: 18, top: 24, bottom: 28 },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
      ],
      axisLine: { lineStyle: { color: "#E2E8F0" } },
      axisLabel: { color: "#94A3B8", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 30,
      splitLine: {
        lineStyle: { color: "#EDF3FA", type: "dashed" },
      },
      axisLabel: { color: "#94A3B8", fontSize: 11 },
    },
    series: [
      {
        name: "Detected events",
        type: "line",
        smooth: 0.25,
        data: [8, 12, 10, 18, 14, 21, 17, 13],
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 2.5, color: "#007BFF" },
        itemStyle: { color: "#007BFF" },
        areaStyle: { color: "rgba(0,123,255,0.08)" },
      },
      {
        name: "Confirmed incidents",
        type: "line",
        smooth: 0.25,
        data: [3, 5, 4, 8, 6, 10, 7, 5],
        symbol: "circle",
        symbolSize: 5,
        lineStyle: { width: 2, color: "#D99A32" },
        itemStyle: { color: "#D99A32" },
      },
    ],
  };

  const healthOption = {
    tooltip: { trigger: "item" },
    legend: {
      orient: "vertical",
      right: 4,
      top: "middle",
      itemWidth: 9,
      itemHeight: 9,
      textStyle: { color: "#64748B", fontSize: 11 },
    },
    series: [
      {
        type: "pie",
        radius: ["63%", "83%"],
        center: ["34%", "50%"],
        label: { show: false },
        data: [
          {
            value: 2391,
            name: "Normal",
            itemStyle: { color: "#27866A" },
          },
          {
            value: 61,
            name: "Attention",
            itemStyle: { color: "#D99A32" },
          },
          {
            value: 18,
            name: "Critical",
            itemStyle: { color: "#C95757" },
          },
          {
            value: 16,
            name: "Offline",
            itemStyle: { color: "#9BA7B2" },
          },
        ],
      },
    ],
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ENGINEERING CONTROL CENTRE</div>
          <h1>Executive Overview</h1>
          <p>
            Fleet condition, technical events and engineering activity at a glance.
          </p>
        </div>

        <div className="heading-actions">
          <button className="secondary-button">
            <CalendarDays size={15} />
            Today
            <ChevronDown size={14} />
          </button>
          <button className="primary-button">
            <Download size={15} />
            Export report
          </button>
        </div>
      </div>

      <div className="notice-bar">
        <div className="notice-icon">
          <Radio size={16} />
        </div>
        <div>
          <strong>Demonstration data</strong>
          <span>
            Values are simulated for interface development and do not represent
            live KONE equipment telemetry.
          </span>
        </div>
        <span className="notice-time">Updated just now</span>
      </div>

      <section className="metric-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="metric-card" key={metric.label}>
              <div className="metric-top">
                <span>{metric.label}</span>
                <div className={`metric-icon ${metric.color}`}>
                  <Icon size={17} />
                </div>
              </div>

              <div className="metric-value">{metric.value}</div>
              <div className="metric-note">{metric.note}</div>
            </article>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <article className="panel trend-panel">
          <div className="panel-heading">
            <div>
              <h2>Technical event activity</h2>
              <p>Detected events compared with confirmed incidents</p>
            </div>
            <button className="subtle-button">
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </div>

          <div className="chart-legend">
            <span><i className="legend-blue" /> Detected events</span>
            <span><i className="legend-amber" /> Confirmed incidents</span>
          </div>

          <ReactECharts
            option={trendOption}
            style={{ height: 245 }}
            notMerge
          />
        </article>

        <article className="panel health-panel">
          <div className="panel-heading">
            <div>
              <h2>Fleet health distribution</h2>
              <p>Current registered fleet status</p>
            </div>
            <button className="more-button">•••</button>
          </div>

          <ReactECharts
            option={healthOption}
            style={{ height: 230 }}
            notMerge
          />

          <div className="health-foot">
            <span>2,486</span> registered elevators
          </div>
        </article>
      </section>

      <section className="lower-grid">
        <article className="panel incidents-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent technical incidents</h2>
              <p>Latest events requiring engineering attention</p>
            </div>
            <button className="text-button">View all <ChevronRight size={14} /></button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>INCIDENT</th>
                  <th>BUILDING / ELEVATOR</th>
                  <th>DESCRIPTION</th>
                  <th>SEVERITY</th>
                  <th>AGE</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((item) => (
                  <tr key={item.id}>
                    <td><strong className="incident-id">{item.id}</strong></td>
                    <td>
                      <strong>{item.site}</strong>
                      <span className="cell-sub">{item.elevator}</span>
                    </td>
                    <td>{item.issue}</td>
                    <td>
                      <span className={`severity ${item.severity.toLowerCase()}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="age-cell">
                      <Clock3 size={13} /> {item.age}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel attention-panel">
          <div className="panel-heading">
            <div>
              <h2>Engineering attention</h2>
              <p>Open items across the fleet</p>
            </div>
          </div>

          <div className="attention-item">
            <div className="attention-symbol red">
              <AlertTriangle size={17} />
            </div>
            <div>
              <strong>Critical incidents</strong>
              <span>4 items need immediate review</span>
            </div>
            <b>04</b>
          </div>

          <div className="attention-item">
            <div className="attention-symbol amber">
              <ClipboardCheck size={17} />
            </div>
            <div>
              <strong>Predictions to validate</strong>
              <span>Engineer review pending</span>
            </div>
            <b>32</b>
          </div>

          <div className="attention-item">
            <div className="attention-symbol grey">
              <Cpu size={17} />
            </div>
            <div>
              <strong>Devices offline</strong>
              <span>Communication unavailable</span>
            </div>
            <b>16</b>
          </div>

          <div className="attention-footer">
            <span className="status-dot" />
            Demo figures · Not connected to live systems
          </div>
        </article>
      </section>
    </>
  );
}

/* --------------------------------------------------
   FLEET REGISTRY
-------------------------------------------------- */

const fleetData = [
  {
    id: "KNE-04-218",
    building: "Orchid Business Park",
    location: "Chennai",
    model: "MonoSpace 700",
    floors: 18,
    capacity: "1000 kg",
    year: 2021,
    status: "Operational",
    device: "EDGE-CH-0218",
    lastService: "18 Oct 2026",
  },
  {
    id: "KNE-02-091",
    building: "Meridian Towers",
    location: "Coimbatore",
    model: "MonoSpace 500",
    floors: 14,
    capacity: "800 kg",
    year: 2020,
    status: "Attention",
    device: "EDGE-CB-0091",
    lastService: "22 Oct 2026",
  },
  {
    id: "KNE-01-443",
    building: "Northgate Centre",
    location: "Bengaluru",
    model: "MiniSpace",
    floors: 22,
    capacity: "1150 kg",
    year: 2022,
    status: "Operational",
    device: "EDGE-BL-0443",
    lastService: "25 Oct 2026",
  },
  {
    id: "KNE-03-117",
    building: "Lakeview Residences",
    location: "Hyderabad",
    model: "MonoSpace 700",
    floors: 16,
    capacity: "1000 kg",
    year: 2019,
    status: "Critical",
    device: "EDGE-HY-0117",
    lastService: "12 Oct 2026",
  },
  {
    id: "KNE-05-302",
    building: "Tech Square",
    location: "Chennai",
    model: "TranSys",
    floors: 28,
    capacity: "1600 kg",
    year: 2023,
    status: "Operational",
    device: "EDGE-CH-0302",
    lastService: "27 Oct 2026",
  },
  {
    id: "KNE-06-188",
    building: "Crescent Plaza",
    location: "Coimbatore",
    model: "MonoSpace 500",
    floors: 12,
    capacity: "800 kg",
    year: 2018,
    status: "Offline",
    device: "EDGE-CB-0188",
    lastService: "08 Oct 2026",
  },
  {
    id: "KNE-07-265",
    building: "Central Business Hub",
    location: "Bengaluru",
    model: "MonoSpace 700",
    floors: 20,
    capacity: "1000 kg",
    year: 2021,
    status: "Operational",
    device: "EDGE-BL-0265",
    lastService: "20 Oct 2026",
  },
  {
    id: "KNE-08-411",
    building: "Greenfield Heights",
    location: "Hyderabad",
    model: "MiniSpace",
    floors: 25,
    capacity: "1150 kg",
    year: 2024,
    status: "Attention",
    device: "EDGE-HY-0411",
    lastService: "29 Oct 2026",
  },
];

type FleetElevator = (typeof fleetData)[number];

function FleetRegistry() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [model, setModel] = useState("All");
  const [selected, setSelected] = useState<FleetElevator | null>(null);

  const filtered = fleetData.filter((elevator) => {
    const matchesSearch =
      `${elevator.id} ${elevator.building} ${elevator.location}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus = status === "All" || elevator.status === status;
    const matchesModel = model === "All" || elevator.model === model;

    return matchesSearch && matchesStatus && matchesModel;
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">FLEET & ASSET MANAGEMENT</div>
          <h1>Elevator Fleet Registry</h1>
          <p>
            Equipment records, building assignments and technical asset information.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => alert("Demo: Add elevator workflow will be connected to the backend.")}
        >
          <Building2 size={15} /> Register elevator
        </button>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><Database size={16} /></div>
        <div>
          <strong>Demonstration fleet records</strong>
          <span>
            These sample assets are simulated and are not connected to KONE production systems.
          </span>
        </div>
      </div>

      <div className="fleet-summary">
        <div className="fleet-summary-card">
          <span>Registered in this view</span>
          <strong>{fleetData.length}</strong>
        </div>
        <div className="fleet-summary-card">
          <span>Operational</span>
          <strong className="green-text">
            {fleetData.filter((e) => e.status === "Operational").length}
          </strong>
        </div>
        <div className="fleet-summary-card">
          <span>Needs attention</span>
          <strong className="amber-text">
            {fleetData.filter((e) => e.status === "Attention").length}
          </strong>
        </div>
        <div className="fleet-summary-card">
          <span>Offline / critical</span>
          <strong className="red-text">
            {fleetData.filter((e) => e.status === "Offline" || e.status === "Critical").length}
          </strong>
        </div>
      </div>

      <section className="panel fleet-panel">
        <div className="panel-heading fleet-heading">
          <div>
            <h2>Registered equipment</h2>
            <p>Search and inspect individual elevator records</p>
          </div>
          <span className="record-count">{filtered.length} records shown</span>
        </div>

        <div className="fleet-filters">
          <div className="fleet-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search elevator ID, building or location..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </div>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All statuses</option>
            <option value="Operational">Operational</option>
            <option value="Attention">Attention</option>
            <option value="Critical">Critical</option>
            <option value="Offline">Offline</option>
          </select>

          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="All">All models</option>
            <option value="MonoSpace 700">MonoSpace 700</option>
            <option value="MonoSpace 500">MonoSpace 500</option>
            <option value="MiniSpace">MiniSpace</option>
            <option value="TranSys">TranSys</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setStatus("All");
              setModel("All");
            }}
          >
            Reset filters
          </button>
        </div>

        <div className="table-wrap fleet-table-wrap">
          <table className="fleet-table">
            <thead>
              <tr>
                <th>ELEVATOR ID</th>
                <th>BUILDING / LOCATION</th>
                <th>MODEL</th>
                <th>FLOORS</th>
                <th>CAPACITY</th>
                <th>INSTALLATION</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((elevator) => (
                <tr key={elevator.id} onClick={() => setSelected(elevator)}>
                  <td>
                    <strong className="incident-id">{elevator.id}</strong>
                  </td>
                  <td>
                    <strong>{elevator.building}</strong>
                    <span className="cell-sub">{elevator.location}</span>
                  </td>
                  <td>{elevator.model}</td>
                  <td>{elevator.floors}</td>
                  <td>{elevator.capacity}</td>
                  <td>{elevator.year}</td>
                  <td>
                    <span className={`fleet-status ${elevator.status.toLowerCase()}`}>
                      {elevator.status}
                    </span>
                  </td>
                  <td><ChevronRight size={16} className="fleet-chevron" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-fleet">
              <Search size={25} />
              <strong>No matching elevators</strong>
              <span>Try changing your search or filters.</span>
              <button
                className="text-button"
                onClick={() => {
                  setSearch("");
                  setStatus("All");
                  setModel("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <section
            className="detail-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detail-header">
              <div>
                <div className="eyebrow">EQUIPMENT RECORD</div>
                <h2>{selected.id}</h2>
                <p>{selected.building} · {selected.location}</p>
              </div>
              <button className="icon-button" onClick={() => setSelected(null)}>
                <X size={19} />
              </button>
            </div>

            <div className="detail-status-row">
              <span className={`fleet-status ${selected.status.toLowerCase()}`}>
                {selected.status}
              </span>
              <span className="detail-demo-label">Simulated record</span>
            </div>

            <h3>Equipment specifications</h3>

            <div className="detail-grid">
              <div><span>Product model</span><strong>{selected.model}</strong></div>
              <div><span>Installation year</span><strong>{selected.year}</strong></div>
              <div><span>Number of floors</span><strong>{selected.floors}</strong></div>
              <div><span>Rated capacity</span><strong>{selected.capacity}</strong></div>
              <div><span>Edge device ID</span><strong>{selected.device}</strong></div>
              <div><span>Last service date</span><strong>{selected.lastService}</strong></div>
            </div>

            <h3>Technical monitoring</h3>

            <div className="detail-info-box">
              <Activity size={18} />
              <div>
                <strong>Monitoring data not connected</strong>
                <span>
                  Sensor telemetry and device diagnostics will appear here
                  after backend integration.
                </span>
              </div>
            </div>

            <button
              className="primary-button drawer-button"
              onClick={() => setSelected(null)}
            >
              Close equipment details
            </button>
          </section>
        </div>
      )}
    </>
  );
}

/* --------------------------------------------------
   LIVE SENSOR INTELLIGENCE
-------------------------------------------------- */

function LiveSensorIntelligence() {
  const [elevator, setElevator] = useState("KNE-04-218");
  const [sensor, setSensor] = useState("Vibration");
  const [period, setPeriod] = useState("1 hour");

  const sensorInfo: Record<
    string,
    {
      value: string;
      unit: string;
      baseline: string;
      quality: string;
      description: string;
    }
  > = {
    Vibration: {
      value: "2.84",
      unit: "mm/s",
      baseline: "1.50 mm/s",
      quality: "98.6%",
      description: "Motor and car vibration",
    },
    Temperature: {
      value: "42.6",
      unit: "°C",
      baseline: "38.0 °C",
      quality: "99.2%",
      description: "Motor temperature",
    },
    "Motor Current": {
      value: "12.4",
      unit: "A",
      baseline: "11.8 A",
      quality: "97.8%",
      description: "Drive motor current",
    },
    "Door Operation": {
      value: "3.2",
      unit: "sec",
      baseline: "2.8 sec",
      quality: "99.0%",
      description: "Door opening and closing duration",
    },
  };

  const current = sensorInfo[sensor];

  const chartValues: Record<string, number[]> = {
    Vibration: [1.4, 1.6, 1.5, 1.8, 1.7, 2.0, 2.3, 2.1, 2.5, 2.8, 2.6, 2.84],
    Temperature: [37.2, 37.5, 37.8, 38.1, 38.3, 39.0, 39.5, 40.1, 40.4, 41.2, 42.0, 42.6],
    "Motor Current": [11.1, 11.3, 11.5, 11.2, 11.7, 12.0, 11.8, 12.2, 12.1, 12.5, 12.2, 12.4],
    "Door Operation": [2.7, 2.8, 2.6, 2.9, 2.8, 3.0, 3.1, 2.9, 3.2, 3.0, 3.1, 3.2],
  };

  const values = chartValues[sensor];

  const chartOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 45, right: 22, top: 28, bottom: 32 },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [
        "09:00",
        "09:05",
        "09:10",
        "09:15",
        "09:20",
        "09:25",
        "09:30",
        "09:35",
        "09:40",
        "09:45",
        "09:50",
        "09:55",
      ],
      axisLabel: { color: "#94A3B8", fontSize: 10 },
      axisLine: { lineStyle: { color: "#E2E8F0" } },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: { color: "#94A3B8", fontSize: 10 },
      splitLine: {
        lineStyle: { color: "#EDF3FA", type: "dashed" },
      },
    },
    series: [
      {
        name: sensor,
        type: "line",
        smooth: 0.3,
        data: values,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 2.5, color: "#0055B8" },
        itemStyle: { color: "#0055B8" },
        areaStyle: { color: "rgba(0,85,184,0.09)" },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { color: "#D99A32", type: "dashed" },
          label: {
            formatter: "Reference baseline",
            color: "#A4772D",
            fontSize: 9,
          },
          data: [{ yAxis: Number.parseFloat(current.baseline) }],
        },
      },
    ],
  };

  const events = [
    {
      time: "09:55",
      title: "Vibration reading increased",
      detail: "Reading above configured reference",
      level: "Attention",
    },
    {
      time: "09:42",
      title: "Telemetry received",
      detail: "Sensor packet received successfully",
      level: "Normal",
    },
    {
      time: "09:30",
      title: "Sensor quality check",
      detail: "Signal quality within expected range",
      level: "Normal",
    },
    {
      time: "09:15",
      title: "Operating cycle recorded",
      detail: "Elevator movement cycle captured",
      level: "Normal",
    },
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">FLEET & ASSET MANAGEMENT / TELEMETRY</div>
          <h1>Live Sensor Intelligence</h1>
          <p>
            Inspect equipment telemetry, signal trends and sensor data quality.
          </p>
        </div>

        <span className="sensor-demo-label">
          <span /> SIMULATED TELEMETRY
        </span>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><Radio size={16} /></div>
        <div>
          <strong>Sensor demonstration environment</strong>
          <span>
            Displayed readings and timestamps are sample data, not live
            measurements from KONE equipment.
          </span>
        </div>
      </div>

      <section className="sensor-selector panel">
        <div className="sensor-select-field">
          <label>SELECT ELEVATOR</label>
          <select
            value={elevator}
            onChange={(e) => setElevator(e.target.value)}
          >
            <option value="KNE-04-218">KNE-04-218 · Orchid Business Park</option>
            <option value="KNE-02-091">KNE-02-091 · Meridian Towers</option>
            <option value="KNE-01-443">KNE-01-443 · Northgate Centre</option>
            <option value="KNE-03-117">KNE-03-117 · Lakeview Residences</option>
          </select>
        </div>

        <div className="sensor-select-field">
          <label>SENSOR CHANNEL</label>
          <select value={sensor} onChange={(e) => setSensor(e.target.value)}>
            {Object.keys(sensorInfo).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="sensor-select-field">
          <label>TIME WINDOW</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>1 hour</option>
            <option>6 hours</option>
            <option>24 hours</option>
          </select>
        </div>
      </section>

      <div className="sensor-metric-grid">
        <div className="sensor-metric panel">
          <span>Current reading</span>
          <strong>{current.value} <small>{current.unit}</small></strong>
          <p>{current.description}</p>
        </div>

        <div className="sensor-metric panel">
          <span>Reference baseline</span>
          <strong>{current.baseline}</strong>
          <p>Configured demo reference</p>
        </div>

        <div className="sensor-metric panel">
          <span>Signal quality</span>
          <strong className="sensor-green">{current.quality}</strong>
          <p>Sample quality indicator</p>
        </div>

        <div className="sensor-metric panel">
          <span>Selected equipment</span>
          <strong className="sensor-equipment">{elevator}</strong>
          <p>Registered sample asset</p>
        </div>
      </div>

      <section className="panel sensor-chart-panel">
        <div className="panel-heading">
          <div>
            <h2>{sensor} trend</h2>
            <p>{current.description} · {period} sample window</p>
          </div>
          <span className="sensor-chart-tag">Historical sample</span>
        </div>

        <ReactECharts
          option={chartOption}
          style={{ height: 310 }}
          notMerge
        />

        <div className="sensor-chart-footer">
          <span><i className="sensor-line-key" /> Recorded sample values</span>
          <span><i className="sensor-baseline-key" /> Reference baseline</span>
        </div>
      </section>

      <section className="panel sensor-events-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent sensor events</h2>
            <p>Sample event log for {elevator}</p>
          </div>
          <span className="record-count">{events.length} events</span>
        </div>

        <div className="sensor-event-list">
          {events.map((event, index) => (
            <div className="sensor-event" key={index}>
              <span className="sensor-event-time">{event.time}</span>
              <span className={`sensor-event-dot ${event.level.toLowerCase()}`} />
              <div className="sensor-event-copy">
                <strong>{event.title}</strong>
                <span>{event.detail}</span>
              </div>
              <span className={`sensor-event-status ${event.level.toLowerCase()}`}>
                {event.level}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


/* --------------------------------------------------
   AI PREDICTION & FAULT DIAGNOSIS
-------------------------------------------------- */

const predictionData = [
  {
    id: "PRD-10842",
    elevator: "KNE-04-218",
    building: "Orchid Business Park",
    component: "Door operator",
    fault: "Irregular door operating time",
    detected: "03 Nov 2026 · 09:42",
    severity: "High",
    confidence: 94,
    score: "0.87",
    model: "DoorHealth v2.4",
    evidence: [
      "Door closing duration increased across recent operating cycles.",
      "Motor current shows variation during door movement.",
      "Observed pattern differs from the configured reference profile.",
    ],
    recommendation: "Review door operator condition and inspect the door mechanism. Confirm findings through a qualified engineer.",
  },
  {
    id: "PRD-10839",
    elevator: "KNE-02-091",
    building: "Meridian Towers",
    component: "Traction system",
    fault: "Elevated vibration pattern",
    detected: "03 Nov 2026 · 09:18",
    severity: "Medium",
    confidence: 88,
    score: "0.73",
    model: "VibrationWatch v1.8",
    evidence: [
      "Vibration amplitude is above the sample reference baseline.",
      "Repeated peaks are present in the recent signal window.",
      "The pattern requires comparison with historical operating cycles.",
    ],
    recommendation: "Review vibration history and arrange a mechanical inspection if the deviation is confirmed.",
  },
  {
    id: "PRD-10835",
    elevator: "KNE-03-117",
    building: "Lakeview Residences",
    component: "Drive motor",
    fault: "Motor temperature deviation",
    detected: "03 Nov 2026 · 08:56",
    severity: "High",
    confidence: 91,
    score: "0.82",
    model: "ThermalGuard v1.3",
    evidence: [
      "Motor temperature is above the configured sample reference.",
      "Temperature has increased over successive sample intervals.",
      "Additional load and ambient temperature context is required.",
    ],
    recommendation: "Check the motor temperature history, load conditions and cooling arrangements. Escalate for engineer review.",
  },
  {
    id: "PRD-10831",
    elevator: "KNE-01-443",
    building: "Northgate Centre",
    component: "Sensor network",
    fault: "Intermittent sensor signal",
    detected: "03 Nov 2026 · 08:31",
    severity: "Low",
    confidence: 79,
    score: "0.61",
    model: "SignalCheck v1.6",
    evidence: [
      "Telemetry packets are missing in selected intervals.",
      "Signal quality varies across recent samples.",
      "Device connectivity history should be reviewed.",
    ],
    recommendation: "Inspect sensor connections and device communication logs before drawing a fault conclusion.",
  },
  {
    id: "PRD-10827",
    elevator: "KNE-08-411",
    building: "Greenfield Heights",
    component: "Door operator",
    fault: "Door cycle duration variation",
    detected: "03 Nov 2026 · 08:04",
    severity: "Medium",
    confidence: 84,
    score: "0.69",
    model: "DoorHealth v2.4",
    evidence: [
      "Door cycle duration varies across recent sample events.",
      "The deviation appears in multiple operating cycles.",
      "No engineer-confirmed fault outcome is available yet.",
    ],
    recommendation: "Compare door cycle measurements and inspect the mechanism if the deviation persists.",
  },
];

type Prediction = (typeof predictionData)[number];

function PredictionDiagnosis() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [reviewStatus, setReviewStatus] = useState("All");
  const [selected, setSelected] = useState<Prediction | null>(null);
  const [investigated, setInvestigated] = useState<string[]>([]);

  const filtered = predictionData.filter((item) => {
    const query = `${item.id} ${item.elevator} ${item.building} ${item.fault} ${item.component}`.toLowerCase();

    const matchesSearch = query.includes(search.toLowerCase());
    const matchesSeverity = severity === "All" || item.severity === severity;
    const isReviewed = investigated.includes(item.id);
    const matchesReview =
      reviewStatus === "All" ||
      (reviewStatus === "Pending" && !isReviewed) ||
      (reviewStatus === "Investigated" && isReviewed);

    return matchesSearch && matchesSeverity && matchesReview;
  });

  const markInvestigated = (id: string) => {
    setInvestigated((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">INTELLIGENCE / CONDITION MONITORING</div>
          <h1>AI Prediction & Fault Diagnosis</h1>
          <p>
            Review model-generated signals, inspect evidence and prioritise
            engineering investigations.
          </p>
        </div>
        <span className="sensor-demo-label">
          <span /> DEMONSTRATION MODELS
        </span>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><Zap size={16} /></div>
        <div>
          <strong>Model-generated demonstration predictions</strong>
          <span>
            These records are simulated examples. Confidence is not a confirmed
            failure probability or an engineer-verified diagnosis.
          </span>
        </div>
      </div>

      <div className="prediction-summary">
        <div className="prediction-summary-card">
          <span>Predictions in sample queue</span>
          <strong>{predictionData.length}</strong>
        </div>
        <div className="prediction-summary-card">
          <span>High priority</span>
          <strong className="red-text">
            {predictionData.filter((p) => p.severity === "High").length}
          </strong>
        </div>
        <div className="prediction-summary-card">
          <span>Awaiting investigation</span>
          <strong className="amber-text">
            {predictionData.filter((p) => !investigated.includes(p.id)).length}
          </strong>
        </div>
        <div className="prediction-summary-card">
          <span>Investigated</span>
          <strong className="green-text">{investigated.length}</strong>
        </div>
      </div>

      <section className="panel prediction-panel">
        <div className="panel-heading">
          <div>
            <h2>Prediction queue</h2>
            <p>Model outputs requiring technical review</p>
          </div>
          <span className="record-count">{filtered.length} records shown</span>
        </div>

        <div className="prediction-filters">
          <div className="fleet-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prediction, elevator, building or fault..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </div>

          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={reviewStatus}
            onChange={(e) => setReviewStatus(e.target.value)}
          >
            <option value="All">All review statuses</option>
            <option value="Pending">Pending investigation</option>
            <option value="Investigated">Investigated</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setSeverity("All");
              setReviewStatus("All");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="prediction-table">
            <thead>
              <tr>
                <th>PREDICTION</th>
                <th>ELEVATOR / BUILDING</th>
                <th>COMPONENT</th>
                <th>DETECTED CONDITION</th>
                <th>CONFIDENCE</th>
                <th>PRIORITY</th>
                <th>REVIEW</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isReviewed = investigated.includes(item.id);

                return (
                  <tr key={item.id} onClick={() => setSelected(item)}>
                    <td>
                      <strong className="incident-id">{item.id}</strong>
                      <span className="cell-sub">{item.detected}</span>
                    </td>
                    <td>
                      <strong>{item.elevator}</strong>
                      <span className="cell-sub">{item.building}</span>
                    </td>
                    <td>{item.component}</td>
                    <td>{item.fault}</td>
                    <td>
                      <div className="confidence-cell">
                        <strong>{item.confidence}%</strong>
                        <div className="confidence-track">
                          <span style={{ width: `${item.confidence}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`severity ${item.severity.toLowerCase()}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`review-state ${isReviewed ? "done" : "pending"}`}>
                        {isReviewed ? "Investigated" : "Pending"}
                      </span>
                    </td>
                    <td><ChevronRight size={16} className="fleet-chevron" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-fleet">
              <Search size={24} />
              <strong>No matching predictions</strong>
              <span>Try a different search or filter.</span>
            </div>
          )}
        </div>
      </section>

      <section className="prediction-note">
        <ShieldCheck size={17} />
        <div>
          <strong>Engineering review is required</strong>
          <span>
            Predictions support investigation. They do not replace qualified
            engineering judgement or certified elevator safety systems.
          </span>
        </div>
      </section>

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <section
            className="detail-drawer prediction-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detail-header">
              <div>
                <div className="eyebrow">PREDICTION RECORD</div>
                <h2>{selected.id}</h2>
                <p>{selected.elevator} · {selected.building}</p>
              </div>
              <button className="icon-button" onClick={() => setSelected(null)}>
                <X size={19} />
              </button>
            </div>

            <div className="detail-status-row">
              <span className={`severity ${selected.severity.toLowerCase()}`}>
                {selected.severity} priority
              </span>
              <span className="detail-demo-label">
                {investigated.includes(selected.id) ? "Investigated" : "Pending investigation"}
              </span>
            </div>

            <h3>Predicted condition</h3>
            <div className="prediction-fault-box">
              <strong>{selected.fault}</strong>
              <span>Component: {selected.component}</span>
            </div>

            <div className="detail-grid prediction-detail-grid">
              <div><span>Model confidence</span><strong>{selected.confidence}%</strong></div>
              <div><span>Anomaly score</span><strong>{selected.score}</strong></div>
              <div><span>Model version</span><strong>{selected.model}</strong></div>
              <div><span>Detected at</span><strong>{selected.detected}</strong></div>
            </div>

            <h3>Supporting evidence</h3>
            <div className="prediction-evidence">
              {selected.evidence.map((evidence, index) => (
                <div key={index}>
                  <CheckCircle2 size={15} />
                  <span>{evidence}</span>
                </div>
              ))}
            </div>

            <h3>Recommended engineering action</h3>
            <div className="detail-info-box">
              <Wrench size={18} />
              <div>
                <strong>Suggested investigation</strong>
                <span>{selected.recommendation}</span>
              </div>
            </div>

            <button
              className="primary-button drawer-button"
              disabled={investigated.includes(selected.id)}
              onClick={() => markInvestigated(selected.id)}
            >
              <ClipboardCheck size={15} />
              {investigated.includes(selected.id)
                ? "Investigation recorded in this session"
                : "Mark as investigated"}
            </button>

            <p className="prediction-disclaimer">
              Demo interaction only. This action is not saved to a backend or
              an official maintenance record.
            </p>
          </section>
        </div>
      )}
    </>
  );
}


/* --------------------------------------------------
   PREDICTION VALIDATION CENTRE
-------------------------------------------------- */

type ValidationOutcome =
  | "Pending"
  | "TP"
  | "FP"
  | "FN"
  | "TN"
  | "Inconclusive"
  | "Not Evaluated";

type ValidationRecord = {
  id: string;
  elevator: string;
  building: string;
  component: string;
  predictedFault: string;
  predictionDate: string;
  outcome: ValidationOutcome;
  engineer: string;
  findings: string;
  model: string;
};

const initialValidationData: ValidationRecord[] = [
  {
    id: "VAL-2041",
    elevator: "KNE-04-218",
    building: "Orchid Business Park",
    component: "Door operator",
    predictedFault: "Irregular door operating time",
    predictionDate: "03 Nov 2026 · 09:42",
    outcome: "Pending",
    engineer: "",
    findings: "",
    model: "DoorHealth v2.4",
  },
  {
    id: "VAL-2038",
    elevator: "KNE-02-091",
    building: "Meridian Towers",
    component: "Traction system",
    predictedFault: "Elevated vibration pattern",
    predictionDate: "03 Nov 2026 · 09:18",
    outcome: "TP",
    engineer: "S. Kumar",
    findings: "Abnormal vibration confirmed during inspection.",
    model: "VibrationWatch v1.8",
  },
  {
    id: "VAL-2035",
    elevator: "KNE-03-117",
    building: "Lakeview Residences",
    component: "Drive motor",
    predictedFault: "Motor temperature deviation",
    predictionDate: "03 Nov 2026 · 08:56",
    outcome: "FP",
    engineer: "R. Anand",
    findings: "Inspection did not identify the predicted fault.",
    model: "ThermalGuard v1.3",
  },
  {
    id: "VAL-2032",
    elevator: "KNE-01-443",
    building: "Northgate Centre",
    component: "Sensor network",
    predictedFault: "Intermittent sensor signal",
    predictionDate: "02 Nov 2026 · 16:20",
    outcome: "TN",
    engineer: "M. Priya",
    findings: "No fault observed in the evaluated period.",
    model: "SignalCheck v1.6",
  },
  {
    id: "VAL-2029",
    elevator: "KNE-08-411",
    building: "Greenfield Heights",
    component: "Door operator",
    predictedFault: "Door cycle duration variation",
    predictionDate: "02 Nov 2026 · 14:05",
    outcome: "FN",
    engineer: "S. Kumar",
    findings: "A door issue was confirmed but no corresponding prediction was recorded.",
    model: "DoorHealth v2.4",
  },
  {
    id: "VAL-2026",
    elevator: "KNE-05-302",
    building: "Tech Square",
    component: "Traction system",
    predictedFault: "Unusual operating pattern",
    predictionDate: "02 Nov 2026 · 11:35",
    outcome: "Inconclusive",
    engineer: "",
    findings: "Available evidence is insufficient to determine the outcome.",
    model: "VibrationWatch v1.8",
  },
  {
    id: "VAL-2023",
    elevator: "KNE-06-188",
    building: "Crescent Plaza",
    component: "Sensor network",
    predictedFault: "Telemetry interruption",
    predictionDate: "01 Nov 2026 · 15:10",
    outcome: "Not Evaluated",
    engineer: "",
    findings: "Outside the current evaluation scope.",
    model: "SignalCheck v1.6",
  },
];

function PredictionValidation() {
  const [records, setRecords] = useState<ValidationRecord[]>(
    initialValidationData
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<ValidationRecord | null>(null);
  const [editOutcome, setEditOutcome] =
    useState<ValidationOutcome>("Pending");
  const [engineer, setEngineer] = useState("");
  const [findings, setFindings] = useState("");

  const tp = records.filter((r) => r.outcome === "TP").length;
  const fp = records.filter((r) => r.outcome === "FP").length;
  const fn = records.filter((r) => r.outcome === "FN").length;
  const tn = records.filter((r) => r.outcome === "TN").length;

  const evaluated = tp + fp + fn + tn;
  const pending = records.filter((r) => r.outcome === "Pending").length;
  const precision = tp + fp > 0 ? tp / (tp + fp) : null;
  const recall = tp + fn > 0 ? tp / (tp + fn) : null;
  const f1 =
    precision !== null &&
    recall !== null &&
    precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : null;
  const fdr = tp + fp > 0 ? fp / (tp + fp) : null;

  const filtered = records.filter((record) => {
    const query =
      `${record.id} ${record.elevator} ${record.building} ${record.component} ${record.predictedFault}`.toLowerCase();

    return (
      query.includes(search.toLowerCase()) &&
      (filter === "All" || record.outcome === filter)
    );
  });

  const openRecord = (record: ValidationRecord) => {
    setSelected(record);
    setEditOutcome(record.outcome);
    setEngineer(record.engineer);
    setFindings(record.findings);
  };

  const saveValidation = () => {
    if (!selected) return;

    if (
      editOutcome !== "Pending" &&
      editOutcome !== "Not Evaluated" &&
      !engineer.trim()
    ) {
      alert("Please enter the validating engineer's name.");
      return;
    }

    setRecords((previous) =>
      previous.map((record) =>
        record.id === selected.id
          ? {
              ...record,
              outcome: editOutcome,
              engineer: engineer.trim(),
              findings: findings.trim(),
            }
          : record
      )
    );

    setSelected(null);
  };

  const percentage = (value: number | null) =>
    value === null ? "—" : `${(value * 100).toFixed(1)}%`;

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">INTELLIGENCE / MODEL EVALUATION</div>
          <h1>Prediction Validation Centre</h1>
          <p>
            Compare model predictions with engineer-confirmed outcomes and
            review model performance.
          </p>
        </div>

        <span className="sensor-demo-label">
          <span /> VALIDATION WORKSPACE
        </span>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><ClipboardCheck size={16} /></div>
        <div>
          <strong>Demonstration validation records</strong>
          <span>
            Sample outcomes are provided for interface testing. Real evaluation
            requires verified inspection results and a defined evaluation window.
          </span>
        </div>
      </div>

      <div className="validation-summary">
        <div className="validation-summary-card">
          <span>Evaluated records</span>
          <strong>{evaluated}</strong>
          <small>TP + FP + FN + TN</small>
        </div>
        <div className="validation-summary-card">
          <span>Awaiting validation</span>
          <strong className="amber-text">{pending}</strong>
          <small>Pending engineer review</small>
        </div>
        <div className="validation-summary-card">
          <span>Precision</span>
          <strong>{percentage(precision)}</strong>
          <small>TP / (TP + FP)</small>
        </div>
        <div className="validation-summary-card">
          <span>Recall</span>
          <strong>{percentage(recall)}</strong>
          <small>TP / (TP + FN)</small>
        </div>
      </div>

      <section className="panel confusion-panel">
        <div className="panel-heading">
          <div>
            <h2>Model outcome distribution</h2>
            <p>Counts from records with an evaluated outcome</p>
          </div>
          <span className="record-count">{evaluated} evaluated</span>
        </div>

        <div className="confusion-grid">
          <div className="confusion-cell tp">
            <span>TRUE POSITIVE</span>
            <strong>{tp}</strong>
            <small>Fault predicted and confirmed</small>
          </div>
          <div className="confusion-cell fp">
            <span>FALSE POSITIVE</span>
            <strong>{fp}</strong>
            <small>Fault predicted but not confirmed</small>
          </div>
          <div className="confusion-cell fn">
            <span>FALSE NEGATIVE</span>
            <strong>{fn}</strong>
            <small>Fault confirmed without a prediction</small>
          </div>
          <div className="confusion-cell tn">
            <span>TRUE NEGATIVE</span>
            <strong>{tn}</strong>
            <small>No fault predicted or observed</small>
          </div>
        </div>

        <div className="validation-metrics-row">
          <div>
            <span>F1 score</span>
            <strong>{percentage(f1)}</strong>
          </div>
          <div>
            <span>False discovery rate</span>
            <strong>{percentage(fdr)}</strong>
          </div>
          <div>
            <span>Evaluation sample size</span>
            <strong>{evaluated}</strong>
          </div>
        </div>

        <p className="validation-formula-note">
          Pending, inconclusive and not-evaluated records are excluded from
          these metrics. A missing inspection report is not automatically a
          false positive, and a fault outside the evaluation window is not
          automatically a false negative.
        </p>
      </section>

      <section className="panel validation-queue-panel">
        <div className="panel-heading">
          <div>
            <h2>Validation queue</h2>
            <p>Review individual predictions and their recorded outcomes</p>
          </div>
          <span className="record-count">{filtered.length} records shown</span>
        </div>

        <div className="prediction-filters">
          <div className="fleet-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search validation ID, elevator or fault..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </div>

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All outcomes</option>
            <option value="Pending">Pending</option>
            <option value="TP">True positive</option>
            <option value="FP">False positive</option>
            <option value="FN">False negative</option>
            <option value="TN">True negative</option>
            <option value="Inconclusive">Inconclusive</option>
            <option value="Not Evaluated">Not evaluated</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="validation-table">
            <thead>
              <tr>
                <th>VALIDATION ID</th>
                <th>ELEVATOR / BUILDING</th>
                <th>COMPONENT</th>
                <th>PREDICTED CONDITION</th>
                <th>MODEL OUTCOME</th>
                <th>VALIDATED BY</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id} onClick={() => openRecord(record)}>
                  <td>
                    <strong className="incident-id">{record.id}</strong>
                    <span className="cell-sub">{record.predictionDate}</span>
                  </td>
                  <td>
                    <strong>{record.elevator}</strong>
                    <span className="cell-sub">{record.building}</span>
                  </td>
                  <td>{record.component}</td>
                  <td>{record.predictedFault}</td>
                  <td>
                    <span className={`outcome-pill ${record.outcome.toLowerCase().replace(" ", "-")}`}>
                      {record.outcome === "TP" ? "True positive" :
                       record.outcome === "FP" ? "False positive" :
                       record.outcome === "FN" ? "False negative" :
                       record.outcome === "TN" ? "True negative" :
                       record.outcome}
                    </span>
                  </td>
                  <td>{record.engineer || "—"}</td>
                  <td><ChevronRight size={16} className="fleet-chevron" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-fleet">
              <Search size={24} />
              <strong>No matching validation records</strong>
              <span>Try another search or outcome filter.</span>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <section
            className="detail-drawer validation-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detail-header">
              <div>
                <div className="eyebrow">ENGINEER VALIDATION RECORD</div>
                <h2>{selected.id}</h2>
                <p>{selected.elevator} · {selected.building}</p>
              </div>
              <button className="icon-button" onClick={() => setSelected(null)}>
                <X size={19} />
              </button>
            </div>

            <h3>Prediction details</h3>
            <div className="prediction-fault-box">
              <strong>{selected.predictedFault}</strong>
              <span>{selected.component} · {selected.model}</span>
              <span>Prediction timestamp: {selected.predictionDate}</span>
            </div>

            <h3>Record validation outcome</h3>
            <div className="validation-form-field">
              <label>ENGINEERING OUTCOME</label>
              <select
                value={editOutcome}
                onChange={(e) => setEditOutcome(e.target.value as ValidationOutcome)}
              >
                <option value="Pending">Pending</option>
                <option value="TP">True positive — fault confirmed</option>
                <option value="FP">False positive — fault not confirmed</option>
                <option value="FN">False negative — missed fault</option>
                <option value="TN">True negative — no fault observed</option>
                <option value="Inconclusive">Inconclusive — insufficient evidence</option>
                <option value="Not Evaluated">Not evaluated</option>
              </select>
            </div>

            <div className="validation-form-field">
              <label>VALIDATING ENGINEER</label>
              <input
                value={engineer}
                onChange={(e) => setEngineer(e.target.value)}
                placeholder="Enter engineer name"
              />
            </div>

            <div className="validation-form-field">
              <label>INSPECTION FINDINGS / COMMENTS</label>
              <textarea
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Record inspection evidence, observations and reasoning..."
                rows={5}
              />
            </div>

            <div className="detail-info-box">
              <ShieldCheck size={18} />
              <div>
                <strong>Validation integrity</strong>
                <span>
                  This demonstration form updates the local interface only.
                  A production system should retain the original prediction
                  and store every validation change in an auditable history.
                </span>
              </div>
            </div>

            <button
              className="primary-button drawer-button"
              onClick={saveValidation}
            >
              <ClipboardCheck size={15} />
              Save validation outcome
            </button>

            <button
              className="secondary-button drawer-button"
              onClick={() => setSelected(null)}
            >
              Cancel
            </button>
          </section>
        </div>
      )}
    </>
  );
}


/* --------------------------------------------------
   INVESTIGATION LABORATORY
-------------------------------------------------- */

const investigationCases = [
  {
    id: "INV-3018",
    elevator: "KNE-04-218",
    building: "Orchid Business Park",
    component: "Door operator",
    event: "Irregular door operating time",
    date: "03 Nov 2026",
    time: "09:42",
    severity: "High",
    model: "DoorHealth v2.4",
    confidence: "94%",
    description:
      "A model-generated signal indicates a change in door operating duration across recent sample cycles.",
    observations: [
      "Door cycle duration increased above the sample reference.",
      "Motor current variation occurred during the same interval.",
      "No engineer-confirmed component fault is recorded in this sample.",
    ],
    readings: [2.7, 2.8, 2.9, 3.1, 3.0, 3.4, 3.5, 3.3, 3.8, 4.0, 3.9, 4.2],
    unit: "seconds",
  },
  {
    id: "INV-3014",
    elevator: "KNE-02-091",
    building: "Meridian Towers",
    component: "Traction system",
    event: "Elevated vibration pattern",
    date: "03 Nov 2026",
    time: "09:18",
    severity: "Medium",
    model: "VibrationWatch v1.8",
    confidence: "88%",
    description:
      "A sample vibration trend shows repeated peaks above its configured reference level.",
    observations: [
      "Vibration readings rise during the selected interval.",
      "Several peaks appear in the sample signal.",
      "Historical operating conditions should be compared before confirming a fault.",
    ],
    readings: [1.2, 1.4, 1.5, 1.8, 1.6, 2.0, 2.2, 2.1, 2.5, 2.7, 2.6, 2.9],
    unit: "mm/s",
  },
  {
    id: "INV-3009",
    elevator: "KNE-03-117",
    building: "Lakeview Residences",
    component: "Drive motor",
    event: "Motor temperature deviation",
    date: "03 Nov 2026",
    time: "08:56",
    severity: "High",
    model: "ThermalGuard v1.3",
    confidence: "91%",
    description:
      "The sample motor temperature trend rises over successive measurement intervals.",
    observations: [
      "Temperature increases across the selected sample window.",
      "The final readings are above the configured reference.",
      "Load and ambient temperature information is not included in this sample.",
    ],
    readings: [36, 37, 37.5, 38, 38.4, 39, 39.4, 40, 40.5, 41, 42, 42.6],
    unit: "°C",
  },
];

function InvestigationLaboratory() {
  const [selectedId, setSelectedId] = useState(investigationCases[0].id);
  const [windowSize, setWindowSize] = useState("Full event");
  const [showBaseline, setShowBaseline] = useState(true);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [replayIndex, setReplayIndex] = useState(11);

  const selected =
    investigationCases.find((item) => item.id === selectedId) ??
    investigationCases[0];

  const visibleValues =
    windowSize === "Last 5 samples"
      ? selected.readings.slice(-5)
      : windowSize === "Last 8 samples"
      ? selected.readings.slice(-8)
      : selected.readings;

  const visibleLabels = visibleValues.map(
    (_, index) => `Sample ${index + 1}`
  );

  const chartOption = {
    tooltip: { trigger: "axis" },
    legend: {
      top: 0,
      right: 8,
      textStyle: { color: "#64748B", fontSize: 10 },
    },
    grid: { left: 48, right: 25, top: 38, bottom: 34 },
    xAxis: {
      type: "category",
      data: visibleLabels,
      axisLabel: { color: "#94A3B8", fontSize: 10 },
      axisLine: { lineStyle: { color: "#E2E8F0" } },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: { color: "#94A3B8", fontSize: 10 },
      splitLine: {
        lineStyle: { color: "#EDF3FA", type: "dashed" },
      },
    },
    series: [
      {
        name: "Recorded sample",
        type: "line",
        smooth: 0.25,
        data: visibleValues,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { color: "#0055B8", width: 2.5 },
        itemStyle: { color: "#0055B8" },
        areaStyle: { color: "rgba(0,85,184,0.08)" },
        markLine: showBaseline
          ? {
              symbol: "none",
              lineStyle: { color: "#D99A32", type: "dashed" },
              label: {
                formatter: "Sample reference",
                color: "#A4772D",
                fontSize: 9,
              },
              data: [{ yAxis: selected.readings[2] }],
            }
          : undefined,
      },
    ],
  };

  const changeCase = (id: string) => {
    setSelectedId(id);
    setReplayIndex(11);
    setNotes(savedNotes[id] ?? "");
  };

  const saveInvestigationNotes = () => {
    setSavedNotes((previous) => ({
      ...previous,
      [selected.id]: notes,
    }));
    alert("Demo notes saved for this browser session.");
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">INTELLIGENCE / EVENT INVESTIGATION</div>
          <h1>Investigation Laboratory</h1>
          <p>
            Examine historical event samples, review model evidence and
            document engineering observations.
          </p>
        </div>
        <span className="sensor-demo-label">
          <span /> REPLAY ENVIRONMENT
        </span>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><Microscope size={16} /></div>
        <div>
          <strong>Historical replay demonstration</strong>
          <span>
            This workspace uses simulated event records and sample signals.
            It does not replay live elevator telemetry.
          </span>
        </div>
      </div>

      <section className="panel investigation-case-panel">
        <div className="panel-heading">
          <div>
            <h2>Select an investigation case</h2>
            <p>Choose a sample event to inspect its evidence</p>
          </div>
          <span className="record-count">{investigationCases.length} sample cases</span>
        </div>

        <div className="investigation-case-list">
          {investigationCases.map((item) => (
            <button
              key={item.id}
              className={`investigation-case ${selected.id === item.id ? "selected" : ""}`}
              onClick={() => changeCase(item.id)}
            >
              <div className="investigation-case-top">
                <strong>{item.id}</strong>
                <span className={`severity ${item.severity.toLowerCase()}`}>
                  {item.severity}
                </span>
              </div>
              <strong className="investigation-case-event">{item.event}</strong>
              <span>{item.elevator} · {item.building}</span>
              <small>{item.date} · {item.time}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel investigation-detail-panel">
        <div className="panel-heading">
          <div>
            <h2>{selected.event}</h2>
            <p>{selected.id} · {selected.elevator} · {selected.component}</p>
          </div>
          <span className={`severity ${selected.severity.toLowerCase()}`}>
            {selected.severity} priority
          </span>
        </div>

        <div className="investigation-meta-grid">
          <div><span>BUILDING</span><strong>{selected.building}</strong></div>
          <div><span>EVENT TIME</span><strong>{selected.date} · {selected.time}</strong></div>
          <div><span>MODEL VERSION</span><strong>{selected.model}</strong></div>
          <div><span>MODEL CONFIDENCE</span><strong>{selected.confidence}</strong></div>
        </div>

        <div className="investigation-description">
          <strong>Event summary</strong>
          <p>{selected.description}</p>
        </div>
      </section>

      <section className="panel investigation-chart-panel">
        <div className="panel-heading">
          <div>
            <h2>Historical signal replay</h2>
            <p>{selected.component} · {selected.unit} · Sample measurements</p>
          </div>
          <select
            value={windowSize}
            onChange={(e) => setWindowSize(e.target.value)}
          >
            <option>Full event</option>
            <option>Last 8 samples</option>
            <option>Last 5 samples</option>
          </select>
        </div>

        <div className="investigation-chart-controls">
          <label className="investigation-toggle">
            <input
              type="checkbox"
              checked={showBaseline}
              onChange={(e) => setShowBaseline(e.target.checked)}
            />
            Show sample reference
          </label>
          <span>12 recorded sample points</span>
        </div>

        <ReactECharts
          option={chartOption}
          style={{ height: 285 }}
          notMerge
        />

        <div className="replay-controls">
          <div className="replay-label">
            <strong>Event position</strong>
            <span>Sample {replayIndex + 1} of 12</span>
          </div>
          <input
            type="range"
            min="0"
            max="11"
            value={replayIndex}
            onChange={(e) => setReplayIndex(Number(e.target.value))}
          />
          <div className="replay-buttons">
            <button
              className="secondary-button"
              onClick={() => setReplayIndex(0)}
            >
              Start
            </button>
            <button
              className="secondary-button"
              onClick={() => setReplayIndex((value) => Math.max(0, value - 1))}
            >
              Previous
            </button>
            <button
              className="secondary-button"
              onClick={() => setReplayIndex((value) => Math.min(11, value + 1))}
            >
              Next
            </button>
            <button
              className="secondary-button"
              onClick={() => setReplayIndex(11)}
            >
              End
            </button>
          </div>
        </div>
      </section>

      <div className="investigation-bottom-grid">
        <section className="panel investigation-evidence-panel">
          <div className="panel-heading">
            <div>
              <h2>Model evidence</h2>
              <p>Signals and observations associated with this sample event</p>
            </div>
          </div>

          <div className="investigation-observations">
            {selected.observations.map((observation, index) => (
              <div key={index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{observation}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel investigation-notes-panel">
          <div className="panel-heading">
            <div>
              <h2>Engineer investigation notes</h2>
              <p>Record observations for this demonstration case</p>
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Enter inspection observations, evidence reviewed and recommended follow-up..."
          />

          <button
            className="primary-button"
            onClick={saveInvestigationNotes}
          >
            <ClipboardCheck size={15} />
            Save investigation notes
          </button>

          {savedNotes[selected.id] && (
            <span className="investigation-saved">
              Notes saved in this browser session
            </span>
          )}
        </section>
      </div>
    </>
  );
}


/* --------------------------------------------------
   CROSS-ELEVATOR INTELLIGENCE
-------------------------------------------------- */

const peerElevators = [
  {
    id: "KNE-04-218",
    building: "Orchid Business Park",
    region: "Coimbatore",
    model: "MonoSpace 500",
    firmware: "FW 4.8.2",
    component: "Door operator",
    events: 8,
    vibration: 2.84,
    doorTime: 4.2,
    status: "Attention",
  },
  {
    id: "KNE-02-091",
    building: "Meridian Towers",
    region: "Coimbatore",
    model: "MonoSpace 500",
    firmware: "FW 4.8.2",
    component: "Traction system",
    events: 6,
    vibration: 2.65,
    doorTime: 3.1,
    status: "Attention",
  },
  {
    id: "KNE-03-117",
    building: "Lakeview Residences",
    region: "Chennai",
    model: "MonoSpace 700",
    firmware: "FW 4.7.9",
    component: "Drive motor",
    events: 5,
    vibration: 1.72,
    doorTime: 3.0,
    status: "Normal",
  },
  {
    id: "KNE-01-443",
    building: "Northgate Centre",
    region: "Bengaluru",
    model: "MonoSpace 500",
    firmware: "FW 4.8.2",
    component: "Sensor network",
    events: 4,
    vibration: 1.95,
    doorTime: 3.2,
    status: "Normal",
  },
  {
    id: "KNE-08-411",
    building: "Greenfield Heights",
    region: "Chennai",
    model: "MonoSpace 700",
    firmware: "FW 4.7.9",
    component: "Door operator",
    events: 7,
    vibration: 2.31,
    doorTime: 3.8,
    status: "Attention",
  },
  {
    id: "KNE-06-188",
    building: "Crescent Plaza",
    region: "Coimbatore",
    model: "MonoSpace 500",
    firmware: "FW 4.8.2",
    component: "Sensor network",
    events: 2,
    vibration: 1.42,
    doorTime: 2.9,
    status: "Normal",
  },
  {
    id: "KNE-05-302",
    building: "Tech Square",
    region: "Bengaluru",
    model: "MonoSpace 700",
    firmware: "FW 4.7.9",
    component: "Traction system",
    events: 3,
    vibration: 1.88,
    doorTime: 3.0,
    status: "Normal",
  },
];

const componentPatterns = [
  { name: "Door operator", count: 11, share: 31 },
  { name: "Traction system", count: 7, share: 20 },
  { name: "Sensor network", count: 6, share: 17 },
  { name: "Drive motor", count: 5, share: 14 },
  { name: "Other components", count: 6, share: 18 },
];

function CrossElevatorIntelligence() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All regions");
  const [model, setModel] = useState("All models");
  const [selectedIds, setSelectedIds] = useState([
    "KNE-04-218",
    "KNE-02-091",
  ]);

  const filtered = peerElevators.filter((item) => {
    const query =
      `${item.id} ${item.building} ${item.component} ${item.model} ${item.region}`.toLowerCase();

    return (
      query.includes(search.toLowerCase()) &&
      (region === "All regions" || item.region === region) &&
      (model === "All models" || item.model === model)
    );
  });

  const selectedElevators = peerElevators.filter((item) =>
    selectedIds.includes(item.id)
  );

  const toggleCompare = (id: string) => {
    setSelectedIds((previous) => {
      if (previous.includes(id)) {
        return previous.length > 1
          ? previous.filter((item) => item !== id)
          : previous;
      }
      return previous.length < 3 ? [...previous, id] : previous;
    });
  };

  const componentChartOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 115, right: 35, top: 8, bottom: 15 },
    xAxis: {
      type: "value",
      axisLabel: { color: "#94A3B8", fontSize: 10 },
      splitLine: { lineStyle: { color: "#EDF3FA", type: "dashed" } },
    },
    yAxis: {
      type: "category",
      data: componentPatterns.map((item) => item.name).reverse(),
      axisLabel: { color: "#64748B", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data: componentPatterns.map((item) => item.count).reverse(),
        barWidth: 13,
        itemStyle: { color: "#1672C5", borderRadius: [0, 3, 3, 0] },
        label: {
          show: true,
          position: "right",
          color: "#53677F",
          fontSize: 10,
        },
      },
    ],
  };

  const regionCounts = [
    { name: "Coimbatore", count: peerElevators.filter((e) => e.region === "Coimbatore").length },
    { name: "Chennai", count: peerElevators.filter((e) => e.region === "Chennai").length },
    { name: "Bengaluru", count: peerElevators.filter((e) => e.region === "Bengaluru").length },
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">INTELLIGENCE / FLEET COMPARISON</div>
          <h1>Cross-Elevator Intelligence</h1>
          <p>
            Compare equipment behaviour, identify recurring patterns and
            investigate similarities across the registered fleet.
          </p>
        </div>
        <span className="sensor-demo-label">
          <span /> FLEET ANALYSIS
        </span>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><Layers size={16} /></div>
        <div>
          <strong>Demonstration fleet comparison</strong>
          <span>
            All counts, readings and equipment comparisons on this page are
            simulated examples and are not production fleet measurements.
          </span>
        </div>
      </div>

      <div className="cross-summary-grid">
        <div className="cross-summary-card">
          <span>Assets in comparison dataset</span>
          <strong>{peerElevators.length}</strong>
          <small>Across 3 demonstration regions</small>
        </div>
        <div className="cross-summary-card">
          <span>Recorded technical events</span>
          <strong>{peerElevators.reduce((sum, item) => sum + item.events, 0)}</strong>
          <small>Sample event count</small>
        </div>
        <div className="cross-summary-card">
          <span>Assets requiring attention</span>
          <strong className="amber-text">
            {peerElevators.filter((item) => item.status === "Attention").length}
          </strong>
          <small>Sample status classification</small>
        </div>
        <div className="cross-summary-card">
          <span>Equipment models</span>
          <strong>{new Set(peerElevators.map((item) => item.model)).size}</strong>
          <small>In the demonstration dataset</small>
        </div>
      </div>

      <div className="cross-analysis-grid">
        <section className="panel cross-chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Component event distribution</h2>
              <p>Sample event counts by equipment component</p>
            </div>
          </div>
          <ReactECharts
            option={componentChartOption}
            style={{ height: 255 }}
            notMerge
          />
        </section>

        <section className="panel cross-region-panel">
          <div className="panel-heading">
            <div>
              <h2>Regional asset distribution</h2>
              <p>Registered assets in this sample dataset</p>
            </div>
          </div>

          <div className="region-list">
            {regionCounts.map((item) => (
              <div className="region-row" key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.count} assets</span>
                </div>
                <div className="region-track">
                  <span style={{ width: `${(item.count / peerElevators.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="region-note">
            Regional totals reflect only the sample assets shown here.
          </div>
        </section>
      </div>

      <section className="panel cross-compare-panel">
        <div className="panel-heading">
          <div>
            <h2>Elevator peer comparison</h2>
            <p>Select up to three assets to compare their sample readings</p>
          </div>
          <span className="record-count">{selectedIds.length} selected</span>
        </div>

        <div className="cross-selection-grid">
          {selectedElevators.map((item) => (
            <div className="cross-selected-card" key={item.id}>
              <span>{item.id}</span>
              <strong>{item.model}</strong>
              <small>{item.building}</small>
              <div>
                <span>Vibration</span>
                <strong>{item.vibration.toFixed(2)} mm/s</strong>
              </div>
              <div>
                <span>Door duration</span>
                <strong>{item.doorTime.toFixed(1)} sec</strong>
              </div>
              <span className={`severity ${item.status === "Attention" ? "medium" : "low"}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="cross-comparison-note">
          <ShieldCheck size={15} />
          <span>
            Compare readings only where sensor type, units, sampling method,
            calibration and operating conditions are compatible.
          </span>
        </div>
      </section>

      <section className="panel cross-table-panel">
        <div className="panel-heading">
          <div>
            <h2>Fleet peer registry</h2>
            <p>Search and select registered sample assets for comparison</p>
          </div>
          <span className="record-count">{filtered.length} assets shown</span>
        </div>

        <div className="prediction-filters">
          <div className="fleet-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search elevator, building or component..."
            />
            {search && (
              <button onClick={() => setSearch("")}><X size={14} /></button>
            )}
          </div>

          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>All regions</option>
            <option>Coimbatore</option>
            <option>Chennai</option>
            <option>Bengaluru</option>
          </select>

          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option>All models</option>
            <option>MonoSpace 500</option>
            <option>MonoSpace 700</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setRegion("All regions");
              setModel("All models");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="cross-table">
            <thead>
              <tr>
                <th>COMPARE</th>
                <th>ELEVATOR ID</th>
                <th>BUILDING / REGION</th>
                <th>MODEL / FIRMWARE</th>
                <th>COMPONENT EVENTS</th>
                <th>VIBRATION</th>
                <th>DOOR DURATION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleCompare(item.id)}
                      disabled={!selectedIds.includes(item.id) && selectedIds.length >= 3}
                    />
                  </td>
                  <td><strong className="incident-id">{item.id}</strong></td>
                  <td>
                    <strong>{item.building}</strong>
                    <span className="cell-sub">{item.region}</span>
                  </td>
                  <td>
                    <strong>{item.model}</strong>
                    <span className="cell-sub">{item.firmware}</span>
                  </td>
                  <td>{item.events}</td>
                  <td>{item.vibration.toFixed(2)} mm/s</td>
                  <td>{item.doorTime.toFixed(1)} sec</td>
                  <td>
                    <span className={`severity ${item.status === "Attention" ? "medium" : "low"}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-fleet">
              <Search size={24} />
              <strong>No matching assets</strong>
              <span>Change the search or filters.</span>
            </div>
          )}
        </div>
      </section>

      <section className="cross-firmware-note">
        <ShieldCheck size={17} />
        <div>
          <strong>Firmware and model comparison requires context</strong>
          <span>
            Similar event counts do not prove a firmware defect. A production
            analysis should control for equipment model, sensor configuration,
            operating conditions, installation age and data quality.
          </span>
        </div>
      </section>
    </>
  );
}


/* --------------------------------------------------
   MODEL OPERATIONS
-------------------------------------------------- */

const initialModels = [
  {
    id: "MDL-001",
    name: "DoorHealth",
    purpose: "Door operator condition monitoring",
    version: "v2.4",
    status: "Production",
    precision: 94.2,
    recall: 89.6,
    f1: 91.8,
    fpr: 5.8,
    latency: 42,
    drift: "Low",
    dataset: "Door cycles dataset · Demo",
    evaluated: "28 Oct 2026",
    deployed: "18 Oct 2026",
  },
  {
    id: "MDL-002",
    name: "VibrationWatch",
    purpose: "Traction and mechanical vibration analysis",
    version: "v1.8",
    status: "Production",
    precision: 91.4,
    recall: 86.2,
    f1: 88.7,
    fpr: 7.1,
    latency: 56,
    drift: "Moderate",
    dataset: "Vibration signals · Demo",
    evaluated: "27 Oct 2026",
    deployed: "15 Oct 2026",
  },
  {
    id: "MDL-003",
    name: "ThermalGuard",
    purpose: "Motor temperature deviation monitoring",
    version: "v1.3",
    status: "Staging",
    precision: 89.5,
    recall: 90.1,
    f1: 89.8,
    fpr: 8.3,
    latency: 38,
    drift: "Low",
    dataset: "Thermal telemetry · Demo",
    evaluated: "29 Oct 2026",
    deployed: "Not deployed",
  },
  {
    id: "MDL-004",
    name: "SignalCheck",
    purpose: "Sensor quality and connectivity monitoring",
    version: "v1.6",
    status: "Review",
    precision: 87.8,
    recall: 82.4,
    f1: 85.0,
    fpr: 10.2,
    latency: 31,
    drift: "High",
    dataset: "Sensor health dataset · Demo",
    evaluated: "26 Oct 2026",
    deployed: "Awaiting approval",
  },
];

function ModelOperations() {
  const [models, setModels] = useState(initialModels);
  const [selectedId, setSelectedId] = useState("MDL-001");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activity, setActivity] = useState<string[]>([
    "DoorHealth v2.4 · Production evaluation completed",
    "VibrationWatch v1.8 · Drift review required",
    "ThermalGuard v1.3 · Staging evaluation completed",
  ]);

  const selected = models.find((model) => model.id === selectedId) ?? models[0];

  const filtered = models.filter((model) => {
    const matchesSearch =
      `${model.name} ${model.id} ${model.version} ${model.purpose}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return (
      matchesSearch &&
      (statusFilter === "All" || model.status === statusFilter)
    );
  });

  const updateModelStatus = (
    id: string,
    status: string,
    action: string
  ) => {
    const target = models.find((model) => model.id === id);
    if (!target) return;

    setModels((previous) =>
      previous.map((model) =>
        model.id === id ? { ...model, status } : model
      )
    );

    setActivity((previous) => [
      `${target.name} ${target.version} · ${action}`,
      ...previous,
    ]);
  };

  const performanceOption = {
    tooltip: { trigger: "axis" },
    legend: {
      top: 0,
      textStyle: { color: "#64748B", fontSize: 10 },
    },
    grid: { left: 42, right: 20, top: 42, bottom: 35 },
    xAxis: {
      type: "category",
      data: models.map((model) => model.name),
      axisLabel: { color: "#64748B", fontSize: 9 },
      axisLine: { lineStyle: { color: "#E2E8F0" } },
    },
    yAxis: {
      type: "value",
      min: 70,
      max: 100,
      axisLabel: {
        color: "#94A3B8",
        fontSize: 9,
        formatter: "{value}%",
      },
      splitLine: { lineStyle: { color: "#EDF3FA", type: "dashed" } },
    },
    series: [
      {
        name: "Precision",
        type: "bar",
        data: models.map((model) => model.precision),
        barMaxWidth: 17,
        itemStyle: { color: "#0055B8", borderRadius: [3, 3, 0, 0] },
      },
      {
        name: "Recall",
        type: "bar",
        data: models.map((model) => model.recall),
        barMaxWidth: 17,
        itemStyle: { color: "#48A3D7", borderRadius: [3, 3, 0, 0] },
      },
      {
        name: "F1 score",
        type: "line",
        data: models.map((model) => model.f1),
        symbolSize: 7,
        lineStyle: { color: "#27866A", width: 2 },
        itemStyle: { color: "#27866A" },
      },
    ],
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">INTELLIGENCE / MODEL GOVERNANCE</div>
          <h1>Model Operations</h1>
          <p>
            Monitor deployed model versions, evaluation metrics, data drift
            and model lifecycle activity.
          </p>
        </div>
        <span className="sensor-demo-label">
          <span /> MODEL GOVERNANCE
        </span>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><ShieldCheck size={16} /></div>
        <div>
          <strong>Demonstration model registry</strong>
          <span>
            Model metrics, versions and lifecycle states are illustrative
            sample values, not measured production performance.
          </span>
        </div>
      </div>

      <div className="model-summary-grid">
        <div className="model-summary-card">
          <span>Registered models</span>
          <strong>{models.length}</strong>
          <small>In demonstration registry</small>
        </div>
        <div className="model-summary-card">
          <span>Production models</span>
          <strong>{models.filter((m) => m.status === "Production").length}</strong>
          <small>Sample deployment state</small>
        </div>
        <div className="model-summary-card">
          <span>Models requiring review</span>
          <strong className="amber-text">
            {models.filter((m) => m.status === "Review" || m.drift === "High").length}
          </strong>
          <small>Review or high drift indicator</small>
        </div>
        <div className="model-summary-card">
          <span>Average inference latency</span>
          <strong>
            {Math.round(models.reduce((sum, m) => sum + m.latency, 0) / models.length)}
            <small> ms</small>
          </strong>
          <small>Illustrative sample latency</small>
        </div>
      </div>

      <section className="panel model-performance-panel">
        <div className="panel-heading">
          <div>
            <h2>Model evaluation comparison</h2>
            <p>Precision, recall and F1 across registered sample models</p>
          </div>
          <span className="record-count">Sample evaluation metrics</span>
        </div>
        <ReactECharts
          option={performanceOption}
          style={{ height: 285 }}
          notMerge
        />
      </section>

      <section className="panel model-registry-panel">
        <div className="panel-heading">
          <div>
            <h2>Model registry</h2>
            <p>Registered models and lifecycle status</p>
          </div>
          <span className="record-count">{filtered.length} models shown</span>
        </div>

        <div className="prediction-filters">
          <div className="fleet-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search model name, version or purpose..."
            />
            {search && (
              <button onClick={() => setSearch("")}><X size={14} /></button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Production</option>
            <option>Staging</option>
            <option>Review</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="model-table">
            <thead>
              <tr>
                <th>MODEL</th>
                <th>VERSION</th>
                <th>PURPOSE</th>
                <th>PRECISION</th>
                <th>RECALL</th>
                <th>F1 SCORE</th>
                <th>DRIFT</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((model) => (
                <tr
                  key={model.id}
                  className={selectedId === model.id ? "model-row-selected" : ""}
                  onClick={() => setSelectedId(model.id)}
                >
                  <td>
                    <strong className="incident-id">{model.name}</strong>
                    <span className="cell-sub">{model.id}</span>
                  </td>
                  <td>{model.version}</td>
                  <td>{model.purpose}</td>
                  <td>{model.precision.toFixed(1)}%</td>
                  <td>{model.recall.toFixed(1)}%</td>
                  <td>{model.f1.toFixed(1)}%</td>
                  <td>
                    <span className={`drift-pill ${model.drift.toLowerCase()}`}>
                      {model.drift}
                    </span>
                  </td>
                  <td>
                    <span className={`model-status ${model.status.toLowerCase()}`}>
                      {model.status}
                    </span>
                  </td>
                  <td><ChevronRight size={16} className="fleet-chevron" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-fleet">
              <Search size={24} />
              <strong>No matching models</strong>
              <span>Try another search or status filter.</span>
            </div>
          )}
        </div>
      </section>

      <div className="model-detail-grid">
        <section className="panel model-detail-panel">
          <div className="panel-heading">
            <div>
              <h2>{selected.name} <span className="model-version-tag">{selected.version}</span></h2>
              <p>{selected.purpose}</p>
            </div>
            <span className={`model-status ${selected.status.toLowerCase()}`}>
              {selected.status}
            </span>
          </div>

          <div className="model-detail-metrics">
            <div><span>Precision</span><strong>{selected.precision}%</strong></div>
            <div><span>Recall</span><strong>{selected.recall}%</strong></div>
            <div><span>F1 score</span><strong>{selected.f1}%</strong></div>
            <div><span>False positive rate</span><strong>{selected.fpr}%</strong></div>
            <div><span>Inference latency</span><strong>{selected.latency} ms</strong></div>
            <div><span>Data drift</span><strong>{selected.drift}</strong></div>
          </div>

          <div className="model-metadata">
            <div><span>Evaluation dataset</span><strong>{selected.dataset}</strong></div>
            <div><span>Last evaluation</span><strong>{selected.evaluated}</strong></div>
            <div><span>Deployment date</span><strong>{selected.deployed}</strong></div>
          </div>

          <div className="model-action-area">
            <strong>Model lifecycle actions</strong>
            <p>
              Prototype controls only. No model is actually deployed,
              approved or rolled back by this interface.
            </p>

            <div className="model-action-buttons">
              {selected.status !== "Production" && (
                <button
                  className="primary-button"
                  onClick={() =>
                    updateModelStatus(
                      selected.id,
                      "Production",
                      "demo deployment approved"
                    )
                  }
                >
                  <ShieldCheck size={14} /> Approve demo deployment
                </button>
              )}

              {selected.status === "Production" && (
                <button
                  className="secondary-button"
                  onClick={() =>
                    updateModelStatus(
                      selected.id,
                      "Staging",
                      "moved to demo staging"
                    )
                  }
                >
                  <Activity size={14} /> Simulate rollback
                </button>
              )}

              {selected.status !== "Review" && (
                <button
                  className="secondary-button"
                  onClick={() =>
                    updateModelStatus(
                      selected.id,
                      "Review",
                      "sent for demo review"
                    )
                  }
                >
                  <ClipboardCheck size={14} /> Send for review
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="panel model-activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Model activity log</h2>
              <p>Recent demonstration lifecycle events</p>
            </div>
          </div>

          <div className="model-activity-list">
            {activity.map((item, index) => (
              <div className="model-activity-item" key={`${item}-${index}`}>
                <span className="model-activity-dot" />
                <div>
                  <strong>{item}</strong>
                  <small>{index === 0 ? "Latest session activity" : "Demonstration record"}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}


/* --------------------------------------------------
   COMPLAINT & COMPLIANCE MANAGEMENT
-------------------------------------------------- */

const initialComplaints = [
  {
    id: "CMP-2041",
    elevator: "KNE-04-218",
    building: "Orchid Business Park",
    category: "Door operation",
    description: "Lift doors are taking longer than usual to close.",
    reportedBy: "Building operator",
    reportedAt: "03 Nov 2026 · 09:35",
    priority: "High",
    status: "Under investigation",
    linkedPrediction: "PRD-10842",
    region: "Coimbatore",
  },
  {
    id: "CMP-2038",
    elevator: "KNE-02-091",
    building: "Meridian Towers",
    category: "Vibration",
    description: "Passengers reported unusual vibration during travel.",
    reportedBy: "Facility manager",
    reportedAt: "03 Nov 2026 · 09:10",
    priority: "Medium",
    status: "Open",
    linkedPrediction: "PRD-10839",
    region: "Coimbatore",
  },
  {
    id: "CMP-2032",
    elevator: "KNE-03-117",
    building: "Lakeview Residences",
    category: "Temperature",
    description: "Maintenance team requested a motor temperature review.",
    reportedBy: "Service technician",
    reportedAt: "02 Nov 2026 · 16:25",
    priority: "Medium",
    status: "Resolved",
    linkedPrediction: "PRD-10835",
    region: "Chennai",
  },
  {
    id: "CMP-2029",
    elevator: "KNE-01-443",
    building: "Northgate Centre",
    category: "Sensor issue",
    description: "Intermittent sensor readings were noticed in the monitoring panel.",
    reportedBy: "Technical support",
    reportedAt: "02 Nov 2026 · 14:40",
    priority: "Low",
    status: "Open",
    linkedPrediction: "Not linked",
    region: "Bengaluru",
  },
  {
    id: "CMP-2024",
    elevator: "KNE-06-188",
    building: "Crescent Plaza",
    category: "Inspection",
    description: "Periodic inspection documentation requires review.",
    reportedBy: "Compliance coordinator",
    reportedAt: "01 Nov 2026 · 11:20",
    priority: "Low",
    status: "Under investigation",
    linkedPrediction: "Not linked",
    region: "Coimbatore",
  },
];

function ComplaintCompliance() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedId, setSelectedId] = useState("CMP-2041");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [engineerNotes, setEngineerNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [showNewComplaint, setShowNewComplaint] = useState(false);

  const selected =
    complaints.find((item) => item.id === selectedId) ?? complaints[0];

  const filtered = complaints.filter((item) => {
    const searchable =
      `${item.id} ${item.elevator} ${item.building} ${item.category} ${item.description}`.toLowerCase();

    return (
      searchable.includes(search.toLowerCase()) &&
      (statusFilter === "All statuses" || item.status === statusFilter) &&
      (priorityFilter === "All priorities" || item.priority === priorityFilter)
    );
  });

  const updateComplaintStatus = (id: string, status: string) => {
    setComplaints((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const saveComplaintNotes = () => {
    setSavedNotes((previous) => ({
      ...previous,
      [selected.id]: engineerNotes,
    }));
    alert("Demonstration notes saved for this browser session.");
  };

  const openComplaint = () => {
    setShowNewComplaint(true);
  };

  const [newBuilding, setNewBuilding] = useState("");
  const [newElevator, setNewElevator] = useState("");
  const [newCategory, setNewCategory] = useState("Door operation");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDescription, setNewDescription] = useState("");

  const submitNewComplaint = () => {
    if (!newBuilding.trim() || !newElevator.trim() || !newDescription.trim()) {
      alert("Please complete the building, elevator ID and description.");
      return;
    }

    const newId = `CMP-${2050 + complaints.length}`;

    const record = {
      id: newId,
      elevator: newElevator.trim(),
      building: newBuilding.trim(),
      category: newCategory,
      description: newDescription.trim(),
      reportedBy: "Technical dashboard user",
      reportedAt: "03 Nov 2026 · Demo entry",
      priority: newPriority,
      status: "Open",
      linkedPrediction: "Not linked",
      region: "Not specified",
    };

    setComplaints((previous) => [record, ...previous]);
    setSelectedId(newId);
    setSearch("");
    setStatusFilter("All statuses");
    setPriorityFilter("All priorities");
    setShowNewComplaint(false);
    setNewBuilding("");
    setNewElevator("");
    setNewDescription("");
    setEngineerNotes("");
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OPERATIONS / SERVICE & COMPLIANCE</div>
          <h1>Complaint & Compliance</h1>
          <p>
            Review customer-reported issues, correlate technical evidence
            and track engineering investigation outcomes.
          </p>
        </div>
        <button className="primary-button" onClick={openComplaint}>
          <ClipboardCheck size={15} /> Register complaint
        </button>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><ShieldCheck size={16} /></div>
        <div>
          <strong>Demonstration complaint records</strong>
          <span>
            These sample complaints illustrate the dashboard workflow.
            A complaint is a reported observation, not proof of equipment failure.
          </span>
        </div>
      </div>

      <div className="complaint-summary-grid">
        <div className="complaint-summary-card">
          <span>Total complaints</span>
          <strong>{complaints.length}</strong>
          <small>Records in this demonstration</small>
        </div>
        <div className="complaint-summary-card">
          <span>Open</span>
          <strong>{complaints.filter((c) => c.status === "Open").length}</strong>
          <small>Awaiting investigation</small>
        </div>
        <div className="complaint-summary-card">
          <span>Under investigation</span>
          <strong>
            {complaints.filter((c) => c.status === "Under investigation").length}
          </strong>
          <small>Engineering review in progress</small>
        </div>
        <div className="complaint-summary-card">
          <span>Resolved</span>
          <strong>{complaints.filter((c) => c.status === "Resolved").length}</strong>
          <small>Marked resolved in the demo</small>
        </div>
      </div>

      {showNewComplaint && (
        <section className="panel complaint-form-panel">
          <div className="panel-heading">
            <div>
              <h2>Register a complaint</h2>
              <p>Create a demonstration record for engineering review</p>
            </div>
            <button
              className="secondary-button"
              onClick={() => setShowNewComplaint(false)}
            >
              Cancel
            </button>
          </div>

          <div className="complaint-form-grid">
            <label>
              Building name
              <input
                value={newBuilding}
                onChange={(e) => setNewBuilding(e.target.value)}
                placeholder="Enter building name"
              />
            </label>
            <label>
              Elevator ID
              <input
                value={newElevator}
                onChange={(e) => setNewElevator(e.target.value)}
                placeholder="e.g. KNE-04-218"
              />
            </label>
            <label>
              Complaint category
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option>Door operation</option>
                <option>Vibration</option>
                <option>Temperature</option>
                <option>Sensor issue</option>
                <option>Inspection</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Priority
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
            <label className="complaint-description-field">
              Description
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe the reported issue..."
              />
            </label>
          </div>

          <button className="primary-button" onClick={submitNewComplaint}>
            <ClipboardCheck size={15} /> Save demonstration complaint
          </button>
        </section>
      )}

      <section className="panel complaint-queue-panel">
        <div className="panel-heading">
          <div>
            <h2>Complaint register</h2>
            <p>Search and review reported equipment issues</p>
          </div>
          <span className="record-count">{filtered.length} records shown</span>
        </div>

        <div className="prediction-filters">
          <div className="fleet-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaint, elevator or building..."
            />
            {search && (
              <button onClick={() => setSearch("")}><X size={14} /></button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All statuses</option>
            <option>Open</option>
            <option>Under investigation</option>
            <option>Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All statuses");
              setPriorityFilter("All priorities");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="complaint-table">
            <thead>
              <tr>
                <th>COMPLAINT ID</th>
                <th>ELEVATOR / BUILDING</th>
                <th>CATEGORY</th>
                <th>REPORTED</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className={selectedId === item.id ? "complaint-row-selected" : ""}
                  onClick={() => {
                    setSelectedId(item.id);
                    setEngineerNotes(savedNotes[item.id] ?? "");
                  }}
                >
                  <td><strong className="incident-id">{item.id}</strong></td>
                  <td>
                    <strong>{item.elevator}</strong>
                    <span className="cell-sub">{item.building}</span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.reportedAt}</td>
                  <td>
                    <span className={`severity ${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`complaint-status ${item.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {item.status}
                    </span>
                  </td>
                  <td><ChevronRight size={16} className="fleet-chevron" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-fleet">
              <Search size={24} />
              <strong>No matching complaints</strong>
              <span>Change your search or filters.</span>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <section className="panel complaint-detail-panel">
          <div className="panel-heading">
            <div>
              <h2>Complaint details · {selected.id}</h2>
              <p>{selected.elevator} · {selected.building}</p>
            </div>
            <span className={`complaint-status ${selected.status.toLowerCase().replaceAll(" ", "-")}`}>
              {selected.status}
            </span>
          </div>

          <div className="complaint-detail-grid">
            <div><span>CATEGORY</span><strong>{selected.category}</strong></div>
            <div><span>REPORTED BY</span><strong>{selected.reportedBy}</strong></div>
            <div><span>REPORTED AT</span><strong>{selected.reportedAt}</strong></div>
            <div><span>REGION</span><strong>{selected.region}</strong></div>
            <div><span>LINKED PREDICTION</span><strong>{selected.linkedPrediction}</strong></div>
            <div><span>PRIORITY</span><strong>{selected.priority}</strong></div>
          </div>

          <div className="complaint-description-box">
            <strong>Reported observation</strong>
            <p>{selected.description}</p>
          </div>

          <div className="complaint-status-actions">
            <strong>Update investigation status</strong>
            <div>
              <button
                className="secondary-button"
                disabled={selected.status === "Open"}
                onClick={() => updateComplaintStatus(selected.id, "Open")}
              >
                Reopen
              </button>
              <button
                className="secondary-button"
                disabled={selected.status === "Under investigation"}
                onClick={() => updateComplaintStatus(selected.id, "Under investigation")}
              >
                Start investigation
              </button>
              <button
                className="primary-button"
                disabled={selected.status === "Resolved"}
                onClick={() => updateComplaintStatus(selected.id, "Resolved")}
              >
                <ClipboardCheck size={14} /> Mark resolved
              </button>
            </div>
          </div>

          <div className="complaint-notes">
            <label htmlFor="complaint-engineer-notes">Engineering investigation notes</label>
            <textarea
              id="complaint-engineer-notes"
              rows={4}
              value={engineerNotes}
              onChange={(e) => setEngineerNotes(e.target.value)}
              placeholder="Record inspection findings, evidence reviewed and follow-up actions..."
            />
            <button className="primary-button" onClick={saveComplaintNotes}>
              Save investigation notes
            </button>
            {savedNotes[selected.id] && (
              <small>Notes saved for this browser session.</small>
            )}
          </div>
        </section>
      )}
    </>
  );
}


/* --------------------------------------------------
   MAINTENANCE ENGINEERING
-------------------------------------------------- */

type MaintenanceRecord = {
  id: string;
  elevator: string;
  building: string;
  component: string;
  issue: string;
  priority: string;
  status: string;
  technician: string;
  dueDate: string;
  linkedRecord: string;
  findings: string;
  parts: string;
  followUp: string;
};

const initialMaintenance: MaintenanceRecord[] = [
  {
    id: "WO-5018",
    elevator: "KNE-04-218",
    building: "Orchid Business Park",
    component: "Door operator",
    issue: "Inspect increased door closing duration",
    priority: "High",
    status: "Assigned",
    technician: "Arun Kumar",
    dueDate: "04 Nov 2026",
    linkedRecord: "CMP-2041 / PRD-10842",
    findings: "",
    parts: "",
    followUp: "Verify door cycle duration after inspection",
  },
  {
    id: "WO-5014",
    elevator: "KNE-02-091",
    building: "Meridian Towers",
    component: "Traction system",
    issue: "Investigate reported vibration pattern",
    priority: "Medium",
    status: "In progress",
    technician: "Priya S",
    dueDate: "04 Nov 2026",
    linkedRecord: "CMP-2038 / PRD-10839",
    findings: "Initial inspection pending",
    parts: "",
    followUp: "Compare vibration readings after inspection",
  },
  {
    id: "WO-5009",
    elevator: "KNE-03-117",
    building: "Lakeview Residences",
    component: "Drive motor",
    issue: "Review motor temperature deviation",
    priority: "High",
    status: "Completed",
    technician: "Karthik R",
    dueDate: "02 Nov 2026",
    linkedRecord: "CMP-2032 / PRD-10835",
    findings: "Sample inspection marked complete",
    parts: "No parts recorded",
    followUp: "Continue routine temperature monitoring",
  },
  {
    id: "WO-5005",
    elevator: "KNE-01-443",
    building: "Northgate Centre",
    component: "Sensor network",
    issue: "Check intermittent sensor signal",
    priority: "Low",
    status: "Open",
    technician: "Unassigned",
    dueDate: "06 Nov 2026",
    linkedRecord: "CMP-2029",
    findings: "",
    parts: "",
    followUp: "Verify signal continuity",
  },
  {
    id: "WO-5001",
    elevator: "KNE-06-188",
    building: "Crescent Plaza",
    component: "Inspection",
    issue: "Review periodic inspection documentation",
    priority: "Low",
    status: "Assigned",
    technician: "Meena V",
    dueDate: "07 Nov 2026",
    linkedRecord: "CMP-2024",
    findings: "",
    parts: "",
    followUp: "Complete document review",
  },
];

function MaintenanceEngineering() {
  const [orders, setOrders] = useState<MaintenanceRecord[]>(initialMaintenance);
  const [selectedId, setSelectedId] = useState("WO-5018");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [technician, setTechnician] = useState("Arun Kumar");
  const [findings, setFindings] = useState("");
  const [parts, setParts] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [showNewOrder, setShowNewOrder] = useState(false);

  const [newElevator, setNewElevator] = useState("");
  const [newBuilding, setNewBuilding] = useState("");
  const [newComponent, setNewComponent] = useState("Door operator");
  const [newIssue, setNewIssue] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");

  const selected =
    orders.find((order) => order.id === selectedId) ?? orders[0];

  const filtered = orders.filter((order) => {
    const searchable =
      `${order.id} ${order.elevator} ${order.building} ${order.component} ${order.issue} ${order.technician}`.toLowerCase();

    return (
      searchable.includes(search.toLowerCase()) &&
      (statusFilter === "All statuses" || order.status === statusFilter) &&
      (priorityFilter === "All priorities" || order.priority === priorityFilter)
    );
  });

  const selectOrder = (order: MaintenanceRecord) => {
    setSelectedId(order.id);
    setTechnician(order.technician);
    setFindings(order.findings);
    setParts(order.parts);
    setFollowUp(order.followUp);
  };

  const updateSelected = (changes: Partial<MaintenanceRecord>) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === selectedId ? { ...order, ...changes } : order
      )
    );
  };

  const saveWorkDetails = () => {
    updateSelected({
      technician,
      findings,
      parts,
      followUp,
    });
    alert("Work-order details saved for this browser session.");
  };

  const changeStatus = (status: string) => {
    updateSelected({ status });
  };

  const createWorkOrder = () => {
    if (!newElevator.trim() || !newBuilding.trim() || !newIssue.trim()) {
      alert("Please enter the elevator ID, building and work description.");
      return;
    }

    const newId = `WO-${5020 + orders.length}`;

    const record: MaintenanceRecord = {
      id: newId,
      elevator: newElevator.trim(),
      building: newBuilding.trim(),
      component: newComponent,
      issue: newIssue.trim(),
      priority: newPriority,
      status: "Open",
      technician: "Unassigned",
      dueDate: "Not scheduled",
      linkedRecord: "Manually created",
      findings: "",
      parts: "",
      followUp: "",
    };

    setOrders((previous) => [record, ...previous]);
    setSelectedId(newId);
    setTechnician("Unassigned");
    setFindings("");
    setParts("");
    setFollowUp("");
    setSearch("");
    setStatusFilter("All statuses");
    setPriorityFilter("All priorities");
    setShowNewOrder(false);
    setNewElevator("");
    setNewBuilding("");
    setNewIssue("");
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OPERATIONS / FIELD SERVICE</div>
          <h1>Maintenance Engineering</h1>
          <p>
            Manage maintenance work orders, technician assignments,
            repair findings and follow-up activities.
          </p>
        </div>
        <button
          className="primary-button"
          onClick={() => setShowNewOrder(true)}
        >
          <ClipboardCheck size={15} /> Create work order
        </button>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><ShieldCheck size={16} /></div>
        <div>
          <strong>Demonstration maintenance records</strong>
          <span>
            Work orders, assignments and completion records are sample data.
            This interface does not dispatch technicians or control elevator equipment.
          </span>
        </div>
      </div>

      <div className="maintenance-summary-grid">
        <div className="maintenance-summary-card">
          <span>Total work orders</span>
          <strong>{orders.length}</strong>
          <small>Records in this demonstration</small>
        </div>
        <div className="maintenance-summary-card">
          <span>Open / assigned</span>
          <strong>
            {orders.filter((o) => o.status === "Open" || o.status === "Assigned").length}
          </strong>
          <small>Awaiting or scheduled work</small>
        </div>
        <div className="maintenance-summary-card">
          <span>In progress</span>
          <strong className="amber-text">
            {orders.filter((o) => o.status === "In progress").length}
          </strong>
          <small>Work being carried out</small>
        </div>
        <div className="maintenance-summary-card">
          <span>Completed</span>
          <strong className="green-text">
            {orders.filter((o) => o.status === "Completed").length}
          </strong>
          <small>Marked complete in the demo</small>
        </div>
      </div>

      {showNewOrder && (
        <section className="panel maintenance-form-panel">
          <div className="panel-heading">
            <div>
              <h2>Create maintenance work order</h2>
              <p>Register a new demonstration maintenance task</p>
            </div>
            <button
              className="secondary-button"
              onClick={() => setShowNewOrder(false)}
            >
              Cancel
            </button>
          </div>

          <div className="maintenance-form-grid">
            <label>
              Elevator ID
              <input
                value={newElevator}
                onChange={(e) => setNewElevator(e.target.value)}
                placeholder="e.g. KNE-04-218"
              />
            </label>
            <label>
              Building
              <input
                value={newBuilding}
                onChange={(e) => setNewBuilding(e.target.value)}
                placeholder="Building name"
              />
            </label>
            <label>
              Component
              <select
                value={newComponent}
                onChange={(e) => setNewComponent(e.target.value)}
              >
                <option>Door operator</option>
                <option>Traction system</option>
                <option>Drive motor</option>
                <option>Sensor network</option>
                <option>Electrical system</option>
                <option>Inspection</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Priority
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
            <label className="maintenance-description-field">
              Work description
              <textarea
                rows={3}
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                placeholder="Describe the maintenance task..."
              />
            </label>
          </div>

          <button className="primary-button" onClick={createWorkOrder}>
            <ClipboardCheck size={15} /> Save work order
          </button>
        </section>
      )}

      <section className="panel maintenance-register-panel">
        <div className="panel-heading">
          <div>
            <h2>Maintenance work-order register</h2>
            <p>Search, filter and inspect engineering tasks</p>
          </div>
          <span className="record-count">{filtered.length} records shown</span>
        </div>

        <div className="prediction-filters">
          <div className="fleet-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search work order, elevator, building or technician..."
            />
            {search && (
              <button onClick={() => setSearch("")}><X size={14} /></button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All statuses</option>
            <option>Open</option>
            <option>Assigned</option>
            <option>In progress</option>
            <option>Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All statuses");
              setPriorityFilter("All priorities");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>WORK ORDER</th>
                <th>ELEVATOR / BUILDING</th>
                <th>COMPONENT</th>
                <th>TECHNICIAN</th>
                <th>DUE DATE</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className={selectedId === order.id ? "maintenance-row-selected" : ""}
                  onClick={() => selectOrder(order)}
                >
                  <td><strong className="incident-id">{order.id}</strong></td>
                  <td>
                    <strong>{order.elevator}</strong>
                    <span className="cell-sub">{order.building}</span>
                  </td>
                  <td>{order.component}</td>
                  <td>{order.technician}</td>
                  <td>{order.dueDate}</td>
                  <td>
                    <span className={`severity ${order.priority.toLowerCase()}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`maintenance-status ${order.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {order.status}
                    </span>
                  </td>
                  <td><ChevronRight size={16} className="fleet-chevron" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-fleet">
              <Search size={24} />
              <strong>No matching work orders</strong>
              <span>Change the search or filters.</span>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <section className="panel maintenance-detail-panel">
          <div className="panel-heading">
            <div>
              <h2>Work-order details · {selected.id}</h2>
              <p>{selected.elevator} · {selected.building}</p>
            </div>
            <span className={`maintenance-status ${selected.status.toLowerCase().replaceAll(" ", "-")}`}>
              {selected.status}
            </span>
          </div>

          <div className="maintenance-detail-grid">
            <div><span>COMPONENT</span><strong>{selected.component}</strong></div>
            <div><span>PRIORITY</span><strong>{selected.priority}</strong></div>
            <div><span>DUE DATE</span><strong>{selected.dueDate}</strong></div>
            <div><span>LINKED RECORD</span><strong>{selected.linkedRecord}</strong></div>
          </div>

          <div className="maintenance-issue-box">
            <strong>Maintenance task</strong>
            <p>{selected.issue}</p>
          </div>

          <div className="maintenance-assignment">
            <label>
              Assigned technician
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
              >
                <option>Unassigned</option>
                <option>Arun Kumar</option>
                <option>Priya S</option>
                <option>Karthik R</option>
                <option>Meena V</option>
                <option>Service Team A</option>
                <option>Service Team B</option>
              </select>
            </label>

            <div className="maintenance-status-control">
              <label htmlFor="maintenance-status-select">Work-order status</label>
              <select
                id="maintenance-status-select"
                value={selected.status}
                onChange={(e) => changeStatus(e.target.value)}
              >
                <option>Open</option>
                <option>Assigned</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div className="maintenance-work-record">
            <h3>Repair and inspection record</h3>

            <label>
              Inspection findings
              <textarea
                rows={3}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Enter observations and inspection findings..."
              />
            </label>

            <label>
              Parts used / replaced
              <textarea
                rows={2}
                value={parts}
                onChange={(e) => setParts(e.target.value)}
                placeholder="Enter parts used, part references or write 'None'..."
              />
            </label>

            <label>
              Follow-up action
              <textarea
                rows={2}
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="Enter required follow-up or monitoring activity..."
              />
            </label>

            <button className="primary-button" onClick={saveWorkDetails}>
              <ClipboardCheck size={15} /> Save work-order updates
            </button>
          </div>
        </section>
      )}
    </>
  );
}


/* --------------------------------------------------
   DEVICE & HARDWARE MANAGEMENT
-------------------------------------------------- */

type HardwareDevice = {
  id: string;
  elevator: string;
  building: string;
  region: string;
  deviceType: string;
  firmware: string;
  status: string;
  lastSeen: string;
  sensors: number;
  samplingRate: string;
  dataQuality: number;
  cpu: number | null;
  temperature: number | null;
  storage: number | null;
  network: string;
};

const initialHardwareDevices: HardwareDevice[] = [
  {
    id: "EDGE-COI-0218",
    elevator: "KNE-04-218",
    building: "Orchid Business Park",
    region: "Coimbatore",
    deviceType: "Edge gateway",
    firmware: "v2.4.1",
    status: "Online",
    lastSeen: "Just now",
    sensors: 8,
    samplingRate: "1,000 Hz",
    dataQuality: 98.6,
    cpu: 42,
    temperature: 38,
    storage: 64,
    network: "Connected",
  },
  {
    id: "EDGE-COI-0091",
    elevator: "KNE-02-091",
    building: "Meridian Towers",
    region: "Coimbatore",
    deviceType: "Edge gateway",
    firmware: "v2.3.8",
    status: "Warning",
    lastSeen: "2 min ago",
    sensors: 7,
    samplingRate: "800 Hz",
    dataQuality: 91.2,
    cpu: 76,
    temperature: 51,
    storage: 82,
    network: "Connected",
  },
  {
    id: "EDGE-CHE-0117",
    elevator: "KNE-03-117",
    building: "Lakeview Residences",
    region: "Chennai",
    deviceType: "Edge gateway",
    firmware: "v2.4.1",
    status: "Online",
    lastSeen: "30 sec ago",
    sensors: 8,
    samplingRate: "1,000 Hz",
    dataQuality: 97.4,
    cpu: 48,
    temperature: 41,
    storage: 58,
    network: "Connected",
  },
  {
    id: "EDGE-BLR-0443",
    elevator: "KNE-01-443",
    building: "Northgate Centre",
    region: "Bengaluru",
    deviceType: "Sensor gateway",
    firmware: "v2.2.5",
    status: "Offline",
    lastSeen: "3 hours ago",
    sensors: 6,
    samplingRate: "500 Hz",
    dataQuality: 0,
    cpu: null,
    temperature: null,
    storage: null,
    network: "Disconnected",
  },
  {
    id: "EDGE-COI-0188",
    elevator: "KNE-06-188",
    building: "Crescent Plaza",
    region: "Coimbatore",
    deviceType: "Edge gateway",
    firmware: "v2.3.8",
    status: "Online",
    lastSeen: "1 min ago",
    sensors: 7,
    samplingRate: "800 Hz",
    dataQuality: 96.1,
    cpu: 39,
    temperature: 36,
    storage: 49,
    network: "Connected",
  },
];

function DeviceHardwareManagement() {
  const [devices, setDevices] = useState<HardwareDevice[]>(initialHardwareDevices);
  const [selectedId, setSelectedId] = useState("EDGE-COI-0218");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [regionFilter, setRegionFilter] = useState("All regions");
  const [showRegistration, setShowRegistration] = useState(false);

  const [newDeviceId, setNewDeviceId] = useState("");
  const [newElevator, setNewElevator] = useState("");
  const [newBuilding, setNewBuilding] = useState("");
  const [newRegion, setNewRegion] = useState("Coimbatore");
  const [newFirmware, setNewFirmware] = useState("v2.4.1");

  const selected =
    devices.find((device) => device.id === selectedId) ?? devices[0];

  const filtered = devices.filter((device) => {
    const searchable =
      `${device.id} ${device.elevator} ${device.building} ${device.region} ${device.firmware}`.toLowerCase();

    return (
      searchable.includes(search.toLowerCase()) &&
      (statusFilter === "All statuses" || device.status === statusFilter) &&
      (regionFilter === "All regions" || device.region === regionFilter)
    );
  });

  const updateDeviceStatus = (id: string, status: string) => {
    setDevices((previous) =>
      previous.map((device) =>
        device.id === id
          ? {
              ...device,
              status,
              network: status === "Offline" ? "Disconnected" : "Connected",
              lastSeen: status === "Offline" ? device.lastSeen : "Just now",
            }
          : device
      )
    );
  };

  const registerDevice = () => {
    if (!newDeviceId.trim() || !newElevator.trim() || !newBuilding.trim()) {
      alert("Enter a device ID, elevator ID and building name.");
      return;
    }

    if (devices.some((device) => device.id === newDeviceId.trim())) {
      alert("A device with this ID already exists.");
      return;
    }

    const record: HardwareDevice = {
      id: newDeviceId.trim(),
      elevator: newElevator.trim(),
      building: newBuilding.trim(),
      region: newRegion,
      deviceType: "Edge gateway",
      firmware: newFirmware,
      status: "Offline",
      lastSeen: "Not yet connected",
      sensors: 0,
      samplingRate: "Not configured",
      dataQuality: 0,
      cpu: null,
      temperature: null,
      storage: null,
      network: "Not connected",
    };

    setDevices((previous) => [record, ...previous]);
    setSelectedId(record.id);
    setShowRegistration(false);
    setNewDeviceId("");
    setNewElevator("");
    setNewBuilding("");
    setSearch("");
    setStatusFilter("All statuses");
    setRegionFilter("All regions");
  };

  const updateFirmware = (firmware: string) => {
    setDevices((previous) =>
      previous.map((device) =>
        device.id === selected.id ? { ...device, firmware } : device
      )
    );
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">FLEET & ASSETS / EDGE INFRASTRUCTURE</div>
          <h1>Device & Hardware Management</h1>
          <p>
            Monitor edge gateways, sensor connectivity, firmware versions
            and device health across registered elevator assets.
          </p>
        </div>
        <button
          className="primary-button"
          onClick={() => setShowRegistration(true)}
        >
          <ClipboardCheck size={15} /> Register device
        </button>
      </div>

      <div className="notice-bar">
        <div className="notice-icon"><ShieldCheck size={16} /></div>
        <div>
          <strong>Demonstration device registry</strong>
          <span>
            Device states and hardware measurements are simulated examples.
            CPU, temperature and storage values are illustrative, not live device readings.
          </span>
        </div>
      </div>

      <div className="device-summary-grid">
        <div className="device-summary-card">
          <span>Registered devices</span>
          <strong>{devices.length}</strong>
          <small>Devices in this demonstration</small>
        </div>
        <div className="device-summary-card">
          <span>Online</span>
          <strong className="green-text">
            {devices.filter((d) => d.status === "Online").length}
          </strong>
          <small>Reporting in sample registry</small>
        </div>
        <div className="device-summary-card">
          <span>Warnings</span>
          <strong className="amber-text">
            {devices.filter((d) => d.status === "Warning").length}
          </strong>
          <small>Require technical review</small>
        </div>
        <div className="device-summary-card">
          <span>Offline</span>
          <strong className="red-text">
            {devices.filter((d) => d.status === "Offline").length}
          </strong>
          <small>Not currently communicating</small>
        </div>
      </div>

      {showRegistration && (
        <section className="panel device-registration-panel">
          <div className="panel-heading">
            <div>
              <h2>Register an edge device</h2>
              <p>Map a demonstration gateway to an elevator asset</p>
            </div>
            <button
              className="secondary-button"
              onClick={() => setShowRegistration(false)}
            >
              Cancel
            </button>
          </div>

          <div className="device-form-grid">
            <label>
              Device ID
              <input
                value={newDeviceId}
                onChange={(e) => setNewDeviceId(e.target.value)}
                placeholder="e.g. EDGE-COI-0500"
              />
            </label>
            <label>
              Elevator ID
              <input
                value={newElevator}
                onChange={(e) => setNewElevator(e.target.value)}
                placeholder="e.g. KNE-04-218"
              />
            </label>
            <label>
              Building
              <input
                value={newBuilding}
                onChange={(e) => setNewBuilding(e.target.value)}
                placeholder="Building name"
              />
            </label>
            <label>
              Region
              <select
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
              >
                <option>Coimbatore</option>
                <option>Chennai</option>
                <option>Bengaluru</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Firmware version
              <select
                value={newFirmware}
                onChange={(e) => setNewFirmware(e.target.value)}
              >
                <option>v2.4.1</option>
                <option>v2.3.8</option>
                <option>v2.2.5</option>
                <option>Pending configuration</option>
              </select>
            </label>
          </div>

          <button className="primary-button" onClick={registerDevice}>
            Register demonstration device
          </button>
        </section>
      )}

      <section className="panel device-registry-panel">
        <div className="panel-heading">
          <div>
            <h2>Registered edge devices</h2>
            <p>Device identity, elevator mapping and communication state</p>
          </div>
          <span className="record-count">{filtered.length} devices shown</span>
        </div>

        <div className="prediction-filters">
          <div className="fleet-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search device, elevator or building..."
            />
            {search && (
              <button onClick={() => setSearch("")}><X size={14} /></button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All statuses</option>
            <option>Online</option>
            <option>Warning</option>
            <option>Offline</option>
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option>All regions</option>
            <option>Coimbatore</option>
            <option>Chennai</option>
            <option>Bengaluru</option>
            <option>Other</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All statuses");
              setRegionFilter("All regions");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="device-table">
            <thead>
              <tr>
                <th>DEVICE ID</th>
                <th>ELEVATOR / BUILDING</th>
                <th>DEVICE TYPE</th>
                <th>FIRMWARE</th>
                <th>SENSORS</th>
                <th>LAST COMMUNICATION</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((device) => (
                <tr
                  key={device.id}
                  className={selectedId === device.id ? "device-row-selected" : ""}
                  onClick={() => setSelectedId(device.id)}
                >
                  <td><strong className="incident-id">{device.id}</strong></td>
                  <td>
                    <strong>{device.elevator}</strong>
                    <span className="cell-sub">{device.building}</span>
                  </td>
                  <td>{device.deviceType}</td>
                  <td>{device.firmware}</td>
                  <td>{device.sensors}</td>
                  <td>{device.lastSeen}</td>
                  <td>
                    <span className={`device-status ${device.status.toLowerCase()}`}>
                      {device.status}
                    </span>
                  </td>
                  <td><ChevronRight size={16} className="fleet-chevron" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-fleet">
              <Search size={24} />
              <strong>No matching devices</strong>
              <span>Change your search or filters.</span>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <section className="panel device-detail-panel">
          <div className="panel-heading">
            <div>
              <h2>Device details · {selected.id}</h2>
              <p>{selected.elevator} · {selected.building} · {selected.region}</p>
            </div>
            <span className={`device-status ${selected.status.toLowerCase()}`}>
              {selected.status}
            </span>
          </div>

          <div className="device-detail-grid">
            <div><span>DEVICE TYPE</span><strong>{selected.deviceType}</strong></div>
            <div><span>FIRMWARE</span><strong>{selected.firmware}</strong></div>
            <div><span>SENSOR INVENTORY</span><strong>{selected.sensors} channels</strong></div>
            <div><span>SAMPLING RATE</span><strong>{selected.samplingRate}</strong></div>
            <div><span>LAST COMMUNICATION</span><strong>{selected.lastSeen}</strong></div>
            <div><span>NETWORK</span><strong>{selected.network}</strong></div>
          </div>

          <div className="device-health-heading">
            <div>
              <h3>Hardware health indicators</h3>
              <p>Illustrative values only · Not live device diagnostics</p>
            </div>
          </div>

          <div className="device-health-grid">
            <div className="device-health-card">
              <span>CPU utilisation</span>
              {selected.cpu === null ? (
                <strong className="unavailable-value">Unavailable</strong>
              ) : (
                <>
                  <strong>{selected.cpu}%</strong>
                  <div className="device-progress">
                    <i style={{ width: `${selected.cpu}%` }} />
                  </div>
                </>
              )}
              <small>Sample gateway measurement</small>
            </div>

            <div className="device-health-card">
              <span>Device temperature</span>
              {selected.temperature === null ? (
                <strong className="unavailable-value">Unavailable</strong>
              ) : (
                <strong>{selected.temperature} °C</strong>
              )}
              <small>Sample hardware reading</small>
            </div>

            <div className="device-health-card">
              <span>Storage utilisation</span>
              {selected.storage === null ? (
                <strong className="unavailable-value">Unavailable</strong>
              ) : (
                <>
                  <strong>{selected.storage}%</strong>
                  <div className="device-progress">
                    <i style={{ width: `${selected.storage}%` }} />
                  </div>
                </>
              )}
              <small>Sample storage indicator</small>
            </div>

            <div className="device-health-card">
              <span>Telemetry data quality</span>
              <strong>{selected.dataQuality}%</strong>
              <div className="device-progress">
                <i style={{ width: `${selected.dataQuality}%` }} />
              </div>
              <small>
                {selected.status === "Offline"
                  ? "No current telemetry received"
                  : "Sample quality indicator"}
              </small>
            </div>
          </div>

          <div className="device-sensor-section">
            <div>
              <h3>Sensor inventory</h3>
              <p>Registered channels associated with this sample device</p>
            </div>

            {selected.sensors === 0 ? (
              <div className="device-empty-sensors">
                No sensor channels have been registered for this device.
              </div>
            ) : (
              <div className="device-sensor-list">
                {[
                  "Vibration",
                  "Motor temperature",
                  "Door position",
                  "Motor current",
                  "Voltage",
                  "Speed / motion",
                  "Acoustic",
                  "Humidity",
                ].slice(0, selected.sensors).map((sensor, index) => (
                  <div className="device-sensor-item" key={sensor}>
                    <span>{sensor}</span>
                    <strong>
                      {index === 0 || index === 1
                        ? "Active"
                        : selected.status === "Offline"
                          ? "No data"
                          : "Registered"}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="device-management-actions">
            <div>
              <h3>Device management actions</h3>
              <p>
                Update the demonstration registry status and firmware record.
                These actions do not contact physical devices.
              </p>
            </div>

            <div className="device-action-controls">
              <label>
                Firmware record
                <select
                  value={selected.firmware}
                  onChange={(e) => updateFirmware(e.target.value)}
                >
                  <option>v2.4.1</option>
                  <option>v2.3.8</option>
                  <option>v2.2.5</option>
                  <option>Pending configuration</option>
                </select>
              </label>

              <label>
                Demonstration device status
                <select
                  value={selected.status}
                  onChange={(e) => updateDeviceStatus(selected.id, e.target.value)}
                >
                  <option>Online</option>
                  <option>Warning</option>
                  <option>Offline</option>
                </select>
              </label>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* --------------------------------------------------
   PLACEHOLDER FOR REMAINING MODULES
-------------------------------------------------- */

function PlaceholderPage({ name }: { name: string }) {
  const Icon =
    navigation.flatMap((group) => group.items)
      .find((item) => item.name === name)?.icon ?? Gauge;

  return (
    <div className="module-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">TECHNICAL OPERATIONS / MODULE</div>
          <h1>{name}</h1>
          <p>{sectionDescriptions[name]}</p>
        </div>
      </div>

      <div className="module-intro panel">
        <div className="module-icon"><Icon size={24} /></div>
        <div>
          <h2>{name}</h2>
          <p>
            This module is part of the KONE technical dashboard. Its detailed
            tables, filters, workflows and API integration will be added in
            the next development stage.
          </p>
          <span className="module-status">
            <span />
            Interface structure ready for development
          </span>
        </div>
      </div>

      <div className="module-placeholder-grid">
        <div className="panel placeholder-block">
          <span>MODULE CONTENT</span>
          <div className="placeholder-line wide" />
          <div className="placeholder-line" />
          <div className="placeholder-line short" />
        </div>

        <div className="panel placeholder-block">
          <span>DATA & FILTERS</span>
          <div className="placeholder-line wide" />
          <div className="placeholder-line" />
          <div className="placeholder-line short" />
        </div>
      </div>
    </div>
  );
}


/* --------------------------------------------------
   REPORTS & ANALYTICS
-------------------------------------------------- */

function ReportsAnalytics() {
  const [region, setRegion] = useState("All regions");
  const [category, setCategory] = useState("All categories");

  const reports = [
    { id: "RPT-301", name: "Fleet Health Summary", category: "Fleet", region: "Coimbatore", date: "03 Nov 2026" },
    { id: "RPT-302", name: "Incident Analysis", category: "Incidents", region: "Chennai", date: "02 Nov 2026" },
    { id: "RPT-303", name: "Maintenance Performance", category: "Maintenance", region: "Bengaluru", date: "01 Nov 2026" },
    { id: "RPT-304", name: "Prediction Validation Summary", category: "AI Models", region: "Coimbatore", date: "31 Oct 2026" },
    { id: "RPT-305", name: "Device Connectivity Report", category: "Devices", region: "Chennai", date: "30 Oct 2026" },
  ];

  const filteredReports = reports.filter((report) =>
    (region === "All regions" || report.region === region) &&
    (category === "All categories" || report.category === category)
  );

  const exportReports = () => {
    const header = ["Report ID", "Report Name", "Category", "Region", "Date"];
    const rows = filteredReports.map((r) => [
      r.id, r.name, r.category, r.region, r.date
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "KONE-technical-reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">TECHNICAL OPERATIONS / PERFORMANCE REPORTING</div>
          <h1>Reports & Analytics</h1>
          <p>Review fleet performance, incident trends and maintenance activity.</p>
        </div>
        <button className="primary-button" onClick={exportReports}>
          Export CSV
        </button>
      </div>

      <div className="notice-bar">
        <div className="notice-icon">i</div>
        <div>
          <strong>Demonstration analytics</strong>
          <span>All figures and records shown here are sample data, not production measurements.</span>
        </div>
      </div>

      <div className="reports-summary-grid">
        {[
          ["Registered elevators", "2,486", "Across demonstration sites"],
          ["Recorded incidents", "145", "Sample reporting period"],
          ["Maintenance completed", "72%", "Illustrative work-order status"],
          ["Available reports", String(reports.length), "Sample report register"],
        ].map(([label, value, note]) => (
          <div className="reports-metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>

      <section className="panel reports-register-panel">
        <div className="panel-heading">
          <div>
            <h2>Report register</h2>
            <p>Filter and export available technical reports</p>
          </div>
          <span className="record-count">{filteredReports.length} records shown</span>
        </div>

        <div className="prediction-filters">
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>All regions</option>
            <option>Coimbatore</option>
            <option>Chennai</option>
            <option>Bengaluru</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All categories</option>
            <option>Fleet</option>
            <option>Incidents</option>
            <option>Maintenance</option>
            <option>AI Models</option>
            <option>Devices</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setRegion("All regions");
              setCategory("All categories");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="reports-table">
            <thead>
              <tr>
                <th>REPORT ID</th>
                <th>REPORT NAME</th>
                <th>CATEGORY</th>
                <th>REGION</th>
                <th>GENERATED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td><strong className="incident-id">{report.id}</strong></td>
                  <td>{report.name}</td>
                  <td>{report.category}</td>
                  <td>{report.region}</td>
                  <td>{report.date}</td>
                  <td><span className="report-ready-status">Ready</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReports.length === 0 && (
            <div className="empty-fleet">No reports match these filters.</div>
          )}
        </div>

        <div className="reports-register-footer">
          <span>Sample report records · {filteredReports.length} displayed</span>
          <button className="primary-button" onClick={exportReports}>
            Export filtered CSV
          </button>
        </div>
      </section>
    </>
  );
}


function AuditActivity() {
  const { token } = useAuth();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All modules");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const modules = [
    "Security & Administration",
    "Executive Overview",
    "Elevator Fleet Registry",
    "Live Sensor Intelligence",
    "Device & Hardware",
    "AI Prediction & Diagnosis",
    "Prediction Validation",
    "Investigation Laboratory",
    "Cross-Elevator Intelligence",
    "Model Operations",
    "Complaint & Compliance",
    "Maintenance Engineering",
    "Reports & Analytics",
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadAuditLogs() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        params.set("limit", "500");

        if (moduleFilter !== "All modules") {
          params.set("module", moduleFilter);
        }

        if (statusFilter !== "All statuses") {
          params.set("status", statusFilter);
        }

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const data = await api.get<AuditLog[]>(
          `/audit?${params.toString()}`,
          token
        );

        if (!cancelled) {
          setLogs(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load audit records."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAuditLogs();

    return () => {
      cancelled = true;
    };
  }, [token, moduleFilter, statusFilter, search]);

  const successCount = logs.filter(
    (log) => log.status === "SUCCESS"
  ).length;

  const failureCount = logs.filter(
    (log) => log.status === "FAILURE"
  ).length;

  const moduleCount = new Set(
    logs.map((log) => log.module)
  ).size;

  const formatDate = (value: string) =>
    new Date(value).toLocaleString();

  const formatValues = (value: string | null) => {
    if (!value) return "No recorded changes";

    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  };

  return (
    <section className="panel security-panel audit-panel">
      <div className="panel-heading">
        <div>
          <h2>Audit Activity</h2>
          <p>
            Centralized activity history across all dashboard modules.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => {
            setSearch("");
            setModuleFilter("All modules");
            setStatusFilter("All statuses");
          }}
        >
          Reset filters
        </button>
      </div>

      {/* AUDIT SUMMARY */}
      <div className="audit-summary-grid">
        <div className="audit-summary-card">
          <span>Events shown</span>
          <strong>{logs.length}</strong>
        </div>

        <div className="audit-summary-card">
          <span>Successful events</span>
          <strong className="audit-success-text">
            {successCount}
          </strong>
        </div>

        <div className="audit-summary-card">
          <span>Failed events</span>
          <strong className="audit-failure-text">
            {failureCount}
          </strong>
        </div>

        <div className="audit-summary-card">
          <span>Modules represented</span>
          <strong>{moduleCount}</strong>
        </div>
      </div>

      {/* FILTERS */}
      <div className="audit-filters">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search user, action or record ID..."
        />

        <select
          value={moduleFilter}
          onChange={(event) => setModuleFilter(event.target.value)}
        >
          <option>All modules</option>
          {modules.map((module) => (
            <option key={module} value={module}>
              {module}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option>All statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILURE">Failure</option>
        </select>
      </div>

      {error && (
        <div className="security-error-message">
          {error}
        </div>
      )}

      {/* AUDIT TABLE */}
      <div className="table-scroll">
        <table className="data-table audit-table">
          <thead>
            <tr>
              <th>EVENT ID</th>
              <th>USER</th>
              <th>MODULE</th>
              <th>ACTION</th>
              <th>STATUS</th>
              <th>TIMESTAMP</th>
              <th>DETAILS</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>Loading audit activity...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  No audit events match your filters.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <strong>AUD-{String(log.id).padStart(4, "0")}</strong>
                  </td>

                  <td>
                    <strong>{log.user_email || "Unknown user"}</strong>
                    <small className="table-subtext">
                      {log.user_role || "Role unavailable"}
                    </small>
                  </td>

                  <td>{log.module}</td>

                  <td>
                    <strong>{log.action}</strong>
                    <small className="table-subtext">
                      {log.description}
                    </small>
                  </td>

                  <td>
                    <span
                      className={`audit-status ${
                        log.status === "SUCCESS"
                          ? "success"
                          : "failure"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td>{formatDate(log.created_at)}</td>

                  <td>
                    <button
                      className="secondary-button"
                      onClick={() => setSelectedLog(log)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="audit-footer">
        Showing up to 500 matching records. Newest events appear first.
      </div>

      {/* EVENT DETAILS */}
      {selectedLog && (
        <div
          className="detail-overlay"
          onClick={() => setSelectedLog(null)}
        >
          <section
            className="detail-drawer audit-detail-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="detail-header">
              <div>
                <div className="eyebrow">AUDIT EVENT</div>
                <h2>
                  AUD-{String(selectedLog.id).padStart(4, "0")}
                </h2>
                <p>{selectedLog.action}</p>
              </div>

              <button
                className="icon-button"
                onClick={() => setSelectedLog(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="detail-grid">
              <div>
                <span>User</span>
                <strong>{selectedLog.user_email || "Unknown"}</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>{selectedLog.user_role || "Unavailable"}</strong>
              </div>

              <div>
                <span>Module</span>
                <strong>{selectedLog.module}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedLog.status}</strong>
              </div>

              <div>
                <span>Entity type</span>
                <strong>{selectedLog.entity_type || "—"}</strong>
              </div>

              <div>
                <span>Entity ID</span>
                <strong>{selectedLog.entity_id || "—"}</strong>
              </div>

              <div>
                <span>IP address</span>
                <strong>{selectedLog.ip_address || "Unavailable"}</strong>
              </div>

              <div>
                <span>Timestamp</span>
                <strong>{formatDate(selectedLog.created_at)}</strong>
              </div>
            </div>

            <h3>Event description</h3>
            <p>{selectedLog.description || "No description available."}</p>

            <h3>Previous values</h3>
            <pre className="audit-json">
              {formatValues(selectedLog.old_values)}
            </pre>

            <h3>New values</h3>
            <pre className="audit-json">
              {formatValues(selectedLog.new_values)}
            </pre>

            <button
              className="primary-button drawer-button"
              onClick={() => setSelectedLog(null)}
            >
              Close details
            </button>
          </section>
        </div>
      )}
    </section>
  );
}

/* --------------------------------------------------
   SECURITY & ADMINISTRATION
-------------------------------------------------- */

function SecurityAdministration() {
  const { user, token } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add-user form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<User["role"]>("Viewer");

  const isAdmin = user?.role === "Administrator";

  // LOAD USERS
  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      if (!token || !isAdmin) {
        setLoadingUsers(false);
        return;
      }

      try {
        setError("");

        const data = await api.get<User[]>("/auth/users", token);

        if (!cancelled) {
          setUsers(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load users."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingUsers(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [token, isAdmin]);

  // UPDATE USER ROLE OR STATUS
  const updateUser = async (
    userId: number,
    changes: {
      role?: User["role"];
      is_active?: boolean;
    }
  ) => {
    if (!token) return;

    try {
      setUpdatingUserId(userId);
      setError("");
      setSuccess("");

      const updatedUser = await api.patch<User>(
        `/auth/users/${userId}`,
        changes,
        token
      );

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.id === userId ? updatedUser : item
        )
      );

      setSuccess(
        `${updatedUser.full_name}'s account was updated successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update user."
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  // CREATE NEW USER
  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) return;

    setError("");
    setSuccess("");

    try {
      setCreatingUser(true);

      const createdUser = await api.post<User>(
        "/auth/users",
        {
          full_name: newFullName.trim(),
          email: newEmail.trim().toLowerCase(),
          password: newPassword,
          role: newRole,
        },
        token
      );

      setUsers((previousUsers) => [createdUser, ...previousUsers]);

      setSuccess(
        `Account for ${createdUser.full_name} was created successfully.`
      );

      setNewFullName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("Viewer");
      setShowCreateForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create user."
      );
    } finally {
      setCreatingUser(false);
    }
  };

  // FILTER USERS
  const filteredUsers = users.filter((item) => {
    const searchText =
      `${item.full_name} ${item.email} ${item.id}`.toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All roles" || item.role === roleFilter;

    const matchesStatus =
      statusFilter === "All statuses" ||
      (statusFilter === "Active" && item.is_active) ||
      (statusFilter === "Inactive" && !item.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsers = users.filter((item) => item.is_active).length;
  const inactiveUsers = users.length - activeUsers;

  // ACCESS CONTROL
  if (!isAdmin) {
    return (
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            SYSTEM MANAGEMENT / ACCESS CONTROL
          </div>
          <h1>Security & Administration</h1>
          <p>
            You do not have permission to manage user accounts.
            Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            SYSTEM MANAGEMENT / ACCESS CONTROL
          </div>
          <h1>Security & Administration</h1>
          <p>Manage registered users, roles and account access.</p>
        </div>

        <button
          className="secondary-button"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>

      {/* INFORMATION */}
      <div className="info-banner">
        <strong>Administrator access</strong>
        <p>
          User information is retrieved from the central PostgreSQL
          database. Role and account changes are enforced by the
          FastAPI backend.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="reports-summary-grid">
        <div className="reports-metric-card">
          <span>Registered users</span>
          <strong>{users.length}</strong>
          <small>Total accounts</small>
        </div>

        <div className="reports-metric-card">
          <span>Active users</span>
          <strong>{activeUsers}</strong>
          <small>Accounts with access</small>
        </div>

        <div className="reports-metric-card">
          <span>Inactive users</span>
          <strong>{inactiveUsers}</strong>
          <small>Disabled accounts</small>
        </div>

        <div className="reports-metric-card">
          <span>Access roles</span>
          <strong>4</strong>
          <small>Defined permission groups</small>
        </div>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="security-success-message">{success}</div>
      )}

      {/* ERROR */}
      {error && (
        <div className="security-error-message">{error}</div>
      )}

      {/* USER REGISTER */}
      <section className="panel security-panel">
        <div className="panel-heading">
          <div>
            <h2>User Access Register</h2>
            <p>Review registered accounts and manage their permissions.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span className="record-count">
              {filteredUsers.length} users shown
            </span>

            <button
              className="primary-button"
              onClick={() => {
                setShowCreateForm((previous) => !previous);
                setError("");
                setSuccess("");
              }}
            >
              {showCreateForm ? "Close Form" : "+ Add User"}
            </button>
          </div>
        </div>

        {/* CREATE USER FORM */}
        {showCreateForm && (
          <form
            onSubmit={createUser}
            className="security-create-form"
          >
            <h3>Create New User</h3>
            <p>
              Create an account and assign its initial access role.
            </p>

            <div className="security-create-grid">
              <label>
                Full name
                <input
                  type="text"
                  value={newFullName}
                  onChange={(event) =>
                    setNewFullName(event.target.value)
                  }
                  placeholder="Enter full name"
                  minLength={2}
                  maxLength={150}
                  required
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={newEmail}
                  onChange={(event) =>
                    setNewEmail(event.target.value)
                  }
                  placeholder="Enter email address"
                  maxLength={255}
                  required
                />
              </label>

              <label>
                Initial password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  maxLength={72}
                  required
                />
              </label>

              <label>
                Assign role
                <select
                  value={newRole}
                  onChange={(event) =>
                    setNewRole(event.target.value as User["role"])
                  }
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Technical Engineer">
                    Technical Engineer
                  </option>
                  <option value="Regional Manager">
                    Regional Manager
                  </option>
                  <option value="Administrator">
                    Administrator
                  </option>
                </select>
              </label>
            </div>

            <div className="security-form-actions">
              <button
                type="button"
                className="secondary-button"
                disabled={creatingUser}
                onClick={() => {
                  setShowCreateForm(false);
                  setNewFullName("");
                  setNewEmail("");
                  setNewPassword("");
                  setNewRole("Viewer");
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={creatingUser}
              >
                {creatingUser ? "Creating..." : "Create Account"}
              </button>
            </div>

            <small>
              New accounts are created as active accounts. Passwords
              are securely hashed by the backend.
            </small>
          </form>
        )}

        {/* SEARCH AND FILTERS */}
        <div className="security-filters">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or user ID..."
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option>All roles</option>
            <option>Administrator</option>
            <option>Technical Engineer</option>
            <option>Regional Manager</option>
            <option>Viewer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setRoleFilter("All roles");
              setStatusFilter("All statuses");
            }}
          >
            Reset
          </button>
        </div>

        {/* USER TABLE */}
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>USER ID</th>
                <th>USER</th>
                <th>ROLE</th>
                <th>ACCOUNT STATUS</th>
                <th>CREATED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan={6}>Loading registered users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6}>No matching users found.</td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const isCurrentUser = item.id === user?.id;
                  const isUpdating = updatingUserId === item.id;

                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>
                          USR-{String(item.id).padStart(3, "0")}
                        </strong>
                      </td>

                      <td>
                        <strong>{item.full_name}</strong>
                        <small className="table-subtext">
                          {item.email}
                        </small>
                      </td>

                      <td>
                        <select
                          value={item.role}
                          disabled={isCurrentUser || isUpdating}
                          onChange={(event) =>
                            updateUser(item.id, {
                              role: event.target.value as User["role"],
                            })
                          }
                        >
                          <option value="Viewer">Viewer</option>
                          <option value="Technical Engineer">
                            Technical Engineer
                          </option>
                          <option value="Regional Manager">
                            Regional Manager
                          </option>
                          <option value="Administrator">
                            Administrator
                          </option>
                        </select>
                      </td>

                      <td>
                        <span
                          className={`status-pill ${
                            item.is_active
                              ? "status-normal"
                              : "status-offline"
                          }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      <td>
                        <button
                          className="secondary-button"
                          disabled={isCurrentUser || isUpdating}
                          onClick={() =>
                            updateUser(item.id, {
                              is_active: !item.is_active,
                            })
                          }
                        >
                          {isUpdating
                            ? "Updating..."
                            : item.is_active
                              ? "Deactivate"
                              : "Activate"}
                        </button>

                        {isCurrentUser && (
                          <small className="table-subtext">
                            Current account
                          </small>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
      <AuditActivity />

      {/* LOWER INFORMATION PANELS */}
      <div className="security-lower-grid">
        <section className="panel security-panel">
          <h2>Role permissions</h2>
          <p>Available permission groups.</p>

          <div className="permission-list">
            {[
              ["Administrator", "Full system administration"],
              ["Technical Engineer", "Fleet, sensors and investigations"],
              ["Regional Manager", "Regional fleet and complaints"],
              ["Viewer", "Read-only dashboard access"],
            ].map(([role, description]) => (
              <div className="permission-row" key={role}>
                <div>
                  <strong>{role}</strong>
                  <small>{description}</small>
                </div>
                <span className="permission-label">Defined</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel security-panel">
          <h2>Account management</h2>
          <p>Important account management rules.</p>

          <div className="permission-list">
            <div className="permission-row">
              <div>
                <strong>Public registration</strong>
                <small>New public accounts receive Viewer access.</small>
              </div>
              <span className="permission-label">Enabled</span>
            </div>

            <div className="permission-row">
              <div>
                <strong>Administrator user creation</strong>
                <small>Administrators can create accounts with assigned roles.</small>
              </div>
              <span className="permission-label">Enabled</span>
            </div>

            <div className="permission-row">
              <div>
                <strong>Role changes</strong>
                <small>Restricted to administrators.</small>
              </div>
              <span className="permission-label">Protected</span>
            </div>

            <div className="permission-row">
              <div>
                <strong>Account activation</strong>
                <small>Administrators control account status.</small>
              </div>
              <span className="permission-label">Protected</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   KONE LOGIN SCREEN
-------------------------------------------------- */

function LoginScreen() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        if (password.length < 8) {
          throw new Error(
            "Password must contain at least 8 characters."
          );
        }

        await register({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        });

      } else {
        await login(
          email.trim().toLowerCase(),
          password
        );
      }

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="kone-login-page">

      <div className="login-brand">
        <div className="login-brand-mark">K</div>

        <div>
          <strong>KONE</strong>
          <span>TECHNICAL INTELLIGENCE</span>
        </div>
      </div>

      <div className="login-content">

        <div className="login-card">

          <div className="login-eyebrow">
            TECHNICAL OPERATIONS PLATFORM
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>

            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Sign Up
            </button>
          </div>

          <h1>
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p className="login-description">
            {mode === "login"
              ? "Sign in to access the KONE Technical Intelligence dashboard."
              : "Register to access the KONE Technical Intelligence platform."}
          </p>

          <form onSubmit={handleSubmit}>

            {mode === "register" && (
              <div className="login-field">
                <label htmlFor="register-name">
                  Full name
                </label>

                <input
                  id="register-name"
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={150}
                  required
                />
              </div>
            )}

            <div className="login-field">
              <label htmlFor="login-email">
                Email address
              </label>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder={
                  mode === "register"
                    ? "Create a password (minimum 8 characters)"
                    : "Enter your password"
                }
                autoComplete={
                  mode === "register"
                    ? "new-password"
                    : "current-password"
                }
                minLength={mode === "register" ? 8 : undefined}
                maxLength={72}
                required
              />
            </div>

            {mode === "register" && (
              <div className="login-field">
                <label htmlFor="confirm-password">
                  Confirm password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  maxLength={72}
                  required
                />
              </div>
            )}

            {error && (
              <div className="login-error" role="alert">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in to dashboard"
                  : "Create account"}
            </button>

          </form>

          {mode === "register" && (
            <div className="signup-role-note">
              <ShieldCheck size={16} />
              <span>
                New accounts receive Viewer access.
                Your permissions can be updated by an administrator.
              </span>
            </div>
          )}

          <div className="login-security">
            <ShieldCheck size={16} />
            <span>
              Secure access · Role-based authentication
            </span>
          </div>

        </div>

        <p className="login-footer">
          © KONE Technical Intelligence · Development prototype
        </p>

      </div>
    </div>
  );
}

/* --------------------------------------------------
   MAIN APPLICATION
-------------------------------------------------- */

export default function App() {
  const { user, loading } = useAuth();

  const [active, setActive] = useState(() => {
  return localStorage.getItem("kone-active-page") || "Executive Overview";
  });
  useEffect(() => {
  localStorage.setItem("kone-active-page", active);
  }, [active]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <span>Verifying your session...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">K</div>
          <div className="brand-copy">
            <strong>KONE</strong>
            <span>TECHNICAL INTELLIGENCE</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">MAIN OFFICE</div>

        <nav className="side-navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">{group.title}</div>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    className={`nav-item ${active === item.name ? "active" : ""}`}
                    onClick={() => {
                      setActive(item.name);
                      setMobileOpen(false);
                    }}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    <span>{item.name}</span>

                    {item.name === "Prediction Validation" && (
                      <i className="nav-count">32</i>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-health">
            <span className="system-indicator" />
            <div>
              <strong>System status</strong>
              <small>Demo interface · Offline data</small>
            </div>
          </div>

          <button
            className="collapse-button"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            <span>Collapse sidebar</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <Header active={active} />

        

<div className="content-area">
  {active === "Executive Overview" ? (
    <Overview />
  ) : active === "Elevator Fleet Registry" ? (
    <FleetRegistry />
  ) : active === "Live Sensor Intelligence" ? (
    <LiveSensorIntelligence />
  ) : active === "Device & Hardware" ? (
    <DeviceHardwareManagement />
  ) : active === "AI Prediction & Diagnosis" ? (
    <PredictionDiagnosis />
  ) : active === "Prediction Validation" ? (
    <PredictionValidation />
  ) : active === "Investigation Laboratory" ? (
    <InvestigationLaboratory />
  ) : active === "Cross-Elevator Intelligence" ? (
    <CrossElevatorIntelligence />
  ) : active === "Model Operations" ? (
    <ModelOperations />
  ) : active === "Complaint & Compliance" ? (
    <ComplaintCompliance />
  ) : active === "Maintenance Engineering" ? (
    <MaintenanceEngineering />
  ) : active === "Reports & Analytics" ? (
    <ReportsAnalytics />
  ) : active === "Security & Administration" ? (
    <SecurityAdministration />
  ) : (
    <PlaceholderPage name={active} />
  )}

  <footer className="page-footer">
    <span>© KONE Technical Intelligence · Development prototype</span>
    <span>Build 0.1.0 · Demo environment</span>
  </footer>
</div>


      </main>

      <button
        className="mobile-menu-button"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
