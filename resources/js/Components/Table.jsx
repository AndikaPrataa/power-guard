export default function Table({ headers, data }) {
    return (
        <table className="w-full border border-gray-300 mt-4 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} className="border px-4 py-2 text-left">{h}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {row.map((col, j) => (
                            <td key={j} className="border px-4 py-3">{col}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
