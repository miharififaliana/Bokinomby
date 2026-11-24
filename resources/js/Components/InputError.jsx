export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'mt-1.5 text-sm text-error ' + className}>
            {message}
        </p>
    ) : null;
}
