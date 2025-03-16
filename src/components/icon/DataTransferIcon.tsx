import Icon from "@ant-design/icons";
import { type GetProps } from "antd";

const DataTransferSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="8963"
    width="1.5rem"
    fill="#fff"
  >
    <path
      d="M851.43552 465.69472c-13.78304-184.30976-174.34624-322.54976-358.64576-308.76672a334.6432 334.6432 0 0 0-279.47008 194.70336C76.72832 372.93056-16.73216 500.9408 4.57728 637.55264a250.3168 250.3168 0 0 0 197.44768 206.72512c13.93664 3.44064 28.24192 5.13024 42.5984 4.99712h580.43392c106.60864-0.03072 193.03424-86.44608 193.06496-193.06496 1.2288-95.26272-71.46496-177.98144-166.72768-190.52544h0.04096z m-51.37408 51.37408c5.96992 5.94944 14.16192 9.1136 22.56896 8.77568h5.00736c71.99744 0 130.36544 58.368 130.36544 130.37568 0 71.99744-58.368 130.38592-130.36544 130.38592H245.97504a132.12672 132.12672 0 0 1-30.11584-3.77856C113.57184 762.2144 47.36 662.58944 67.97312 560.29184a188.93824 188.93824 0 0 1 170.45504-151.04 31.47776 31.47776 0 0 0 26.44992-20.03968c54.56896-140.62592 212.80768-210.39104 353.44384-155.82208A273.13152 273.13152 0 0 1 792.64768 487.0144v3.76832c-1.2288 12.55424 1.2288 20.03968 7.5264 26.33728l-0.11264-0.0512z"
      p-id="8964"
    ></path>
    <path
      d="M486.63552 565.9648a26.7264 26.7264 0 0 0-35.35872 0l-31.3344 31.35488v-145.408a25.10848 25.10848 0 1 0-50.14528 0v145.408l-31.3344-31.35488a26.7264 26.7264 0 0 0-35.34848 0 24.2176 24.2176 0 0 0 0 35.34848l73.9328 73.9328c1.23904 1.24928 2.52928 1.24928 3.77856 2.53952 1.23904 1.31072 2.53952 1.23904 3.76832 2.53952 1.23904 0 2.52928 1.2288 3.76832 1.2288h12.55424c1.23904 0 2.52928-1.2288 3.76832-1.2288 2.78528-1.21856 5.33504-2.90816 7.53664-5.00736l73.94304-73.94304a24.2176 24.2176 0 0 0 0-35.34848l0.47104-0.06144z m208.32256-56.38144l-74.17856-73.99424-1.23904-1.23904c-1.2288 0-1.2288-1.23904-2.51904-1.23904-1.30048 0-1.23904-1.23904-2.53952-1.23904-1.28 0-1.23904-1.23904-2.51904-1.23904-1.30048 0-1.25952 0-2.53952-1.23904h-15.02208c-1.23904 0-1.23904 0-2.53952 1.23904a1.23904 1.23904 0 0 0-1.23904 1.23904c-1.2288 0-1.2288 1.23904-2.53952 1.23904l-1.2288 1.23904c-1.2288 0-1.2288 1.23904-2.52928 1.23904l-73.8816 73.99424a24.99584 24.99584 0 0 0 35.33824 35.34848l31.36512-31.51872v145.39776a25.05728 25.05728 0 0 0 26.27584 23.84896 25.07776 25.07776 0 0 0 23.84896-23.84896V513.41312l31.34464 31.3344a24.2176 24.2176 0 0 0 35.35872 0 23.56224 23.56224 0 0 0 1.2288-35.33824l-0.24576 0.17408z"
      p-id="8965"
    ></path>
  </svg>
);
const DataTransferIcon = (props: Partial<GetProps<typeof Icon>>) => {
  return <Icon component={DataTransferSvg} {...props} />;
};

export default DataTransferIcon;
