import styles from "./index.module.css";

type ItemProps = {
  icon?: React.ReactNode;
  title?: string;
  onClick?: () => void;
};

const Item = ({ icon, title, onClick }: ItemProps) => {
  return (
    <div className={styles.item} onClick={onClick}>
      <span className={styles.icon}>{icon}</span>
      <span>{title}</span>
    </div>
  );
};
export default Item;
