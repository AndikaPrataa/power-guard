export default function Card({ label, value, unit }) {
    return (
        <div className="w-48 h-40 border rounded-2xl shadow p-6 text-center">
            <h2 className="text-lg">{label}</h2>
            <p className="text-3xl font-semibold mt-4">
                {value} <span className="text-xl">{unit}</span>
            </p>
        </div>
    );
}
