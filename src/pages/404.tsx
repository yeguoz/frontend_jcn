import { FrownOutlined } from "@ant-design/icons";
const NotFound = () => {
  return (
    <div
      style={{
        width: "100%",
        fontSize: "2rem",
        textAlign: "center",
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
