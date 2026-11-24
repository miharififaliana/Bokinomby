export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 44 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M8 2.5h28a5.5 5.5 0 0 1 5.5 5.5v23.4a6 6 0 0 1-2.4 4.8L25.4 49.2a6 6 0 0 1-6.8 0L4.9 36.2A6 6 0 0 1 2.5 31.4V8A5.5 5.5 0 0 1 8 2.5Z"
                stroke="currentColor"
                strokeWidth="2.4"
            />
            <circle cx="22" cy="12.5" r="3.1" stroke="currentColor" strokeWidth="2.4" />
            <path
                d="M15.5 24h7.2a4.7 4.7 0 0 1 0 9.4h-7.2V24Zm0 9.2h7.8a4.7 4.7 0 0 1 0 9.4h-7.8V33.2Zm0-9.2v18.6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
