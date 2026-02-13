import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/politica-de-datos")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
			<article className="max-w-3xl mx-auto prose prose-gray">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Política de Tratamiento de Datos Personales
				</h1>

				<p className="text-gray-700 leading-relaxed">
					En cumplimiento de la Ley 1581 de 2012 (Ley de Protección de Datos
					Personales) y el Decreto 1377 de 2013, El Sembrador Colombia informa a
					los titulares de los datos personales lo siguiente:
				</p>

				<h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
					1. Responsable del tratamiento
				</h2>
				<p className="text-gray-700 leading-relaxed">
					El Sembrador Colombia es el responsable del tratamiento de los datos
					personales recolectados a través de este sitio web.
				</p>

				<h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
					2. Finalidad del tratamiento
				</h2>
				<p className="text-gray-700 leading-relaxed">
					Los datos personales recolectados (nombre, correo electrónico y
					teléfono) serán utilizados para las siguientes finalidades:
				</p>
				<ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
					<li>
						Gestionar la inscripción y participación en los eventos organizados
						por El Sembrador Colombia.
					</li>
					<li>
						Enviar comunicaciones relacionadas con los eventos a los que el
						titular se ha inscrito.
					</li>
					<li>
						Contactar al titular para confirmar su asistencia o informar sobre
						cambios en los eventos.
					</li>
				</ul>

				<h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
					3. Derechos del titular
				</h2>
				<p className="text-gray-700 leading-relaxed">
					Como titular de los datos personales, usted tiene derecho a:
				</p>
				<ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
					<li>Conocer, actualizar y rectificar sus datos personales.</li>
					<li>
						Solicitar prueba de la autorización otorgada para el tratamiento de
						sus datos.
					</li>
					<li>
						Ser informado sobre el uso que se ha dado a sus datos personales.
					</li>
					<li>
						Revocar la autorización y/o solicitar la supresión de sus datos
						cuando considere que no se han respetado los principios, derechos y
						garantías constitucionales y legales.
					</li>
					<li>
						Presentar quejas ante la Superintendencia de Industria y Comercio
						por infracciones a la ley.
					</li>
				</ul>

				<h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
					4. Mecanismos para ejercer sus derechos
				</h2>
				<p className="text-gray-700 leading-relaxed">
					Para ejercer sus derechos de habeas data, puede comunicarse con El
					Sembrador Colombia a través de los canales de contacto disponibles en
					nuestro sitio web.
				</p>

				<h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
					5. Vigencia
				</h2>
				<p className="text-gray-700 leading-relaxed">
					Los datos personales serán tratados durante el tiempo que sea
					necesario para cumplir con las finalidades descritas, y serán
					eliminados cuando ya no sean necesarios o cuando el titular solicite
					su supresión, siempre que no exista un deber legal o contractual que
					obligue a su conservación.
				</p>

				<p className="text-gray-500 text-sm mt-12">
					Última actualización: Febrero 2025
				</p>
			</article>
		</main>
	);
}
