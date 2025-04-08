import CreatePrivacyPolicyForm from "./CreatePrivacyPolicyForm";

type CreateCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePrivayPolicyModal(
  props: CreateCategoryModalProps
) {
  // useEffect(() => {
  //   if (!state?.message && pending) {
  //     if (props.isOpen && props.onClose) {
  //       props.onClose();
  //     }
  //   }
  //   return () => {};
  // }, [pending, props, state?.message]);

  if (!props.isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={props.onClose}
    >
      <div
        className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <button
          onClick={props.onClose}
          className="absolute top-2 right-2 bg-[#F4B728] text-black text-2xl rounded-full w-12 h-12 p-2 cursor-pointer font-extrabold"
        >
          ×
        </button>
        <CreatePrivacyPolicyForm isOpen={props.isOpen} onClose={props.onClose}/>
      </div>
    </div>
  );
}
