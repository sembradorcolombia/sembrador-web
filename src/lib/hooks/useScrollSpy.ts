import { type RefObject, useEffect, useState } from "react";

export function useScrollSpy(
	sectionRefs: RefObject<HTMLElement | null>[],
	options?: IntersectionObserverInit,
) {
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = sectionRefs.findIndex(
							(ref) => ref.current === entry.target,
						);
						if (index !== -1) {
							setActiveIndex(index);
						}
					}
				});
			},
			{ threshold: 0.5, ...options },
		);

		sectionRefs.forEach((ref) => {
			if (ref.current) {
				observer.observe(ref.current);
			}
		});

		return () => {
			observer.disconnect();
		};
	}, [sectionRefs, options]);

	return activeIndex;
}
