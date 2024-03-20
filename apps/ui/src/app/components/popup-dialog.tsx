type Props = {
  onAccept: () => void;
};

const PopupDialog = ({ onAccept }: Props) => {
  return (
    <div className="popup-dialog">
      <div className="content-wrapper">
        <div className="scrollable-content">
          {Array.from({ length: 50 }).map((_, index) => (
            <p key={index}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </div>
        <button onClick={onAccept} className="accept-button">
          Accept Terms
        </button>
      </div>
    </div>
  );
};

export default PopupDialog;
