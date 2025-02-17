import { FrownOutlined } from "@ant-design/icons";
const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "2rem",
        marginTop: "6rem",
        color: "#6b798e",
      }}
    >
      <div style={{marginBottom: "1rem"}}>
        <FrownOutlined style={{fontSize: "10rem"}}/>
      </div>
      <div>404 Not Found</div>
    </div>
  );
};

export default NotFound;
