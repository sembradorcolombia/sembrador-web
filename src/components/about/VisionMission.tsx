interface VisionMissionProps {
	vision?: string;
	mission?: string;
}

function Statement({ title, body }: { title: string; body: string }) {
	return (
		<section className="border-t border-gray-100 pt-12">
			<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mb-4">
				{title}
			</h2>
			<p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
				{body}
			</p>
		</section>
	);
}

export function VisionMission({ vision, mission }: VisionMissionProps) {
	if (!vision && !mission) return null;

	return (
		<>
			{vision && <Statement title="Visión" body={vision} />}
			{mission && <Statement title="Misión" body={mission} />}
		</>
	);
}
