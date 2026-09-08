export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-clinical-600 shadow-sm focus:ring-clinical-500 ' +
                className
            }
        />
    );
}