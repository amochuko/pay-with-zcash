
type CreateButtonProps = {
  openModal: () => void;
  label: string;
};
export default function CreateButton(props: CreateButtonProps){

    return (
      <button
        className="text-xl font-normal text-black dark:text-white cursor-pointer border-amber-300 border-2 p-3"
        onClick={props.openModal}
      >
        {props.label}
      </button>
    );
}
