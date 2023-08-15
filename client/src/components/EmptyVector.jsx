import empty from "../assets/empty.svg";

export default function EmptyVector({ className = null }) {
  let classes = "pb-8 w-[300px] mx-auto flex flex-col gap-1 ";
  if (className) {
    classes += className;
  }
  return (
    <div className={classes}>
      <img className="w-full" src={empty} alt="" />
      <span className="text-center text-gray-500 text-sm italic">
        Nothing to see here
      </span>
    </div>
  );
}
