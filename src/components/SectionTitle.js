export default function SectionTitle({ title, subtitle, center = true }) {
    return (
        <div className={`mb-12 ${center ? 'text-center' : 'text-left'}`}>
            {subtitle && (
                <span className="block text-secondary font-semibold tracking-wide uppercase text-sm mb-2">
                    {subtitle}
                </span>
            )}
            <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl">
                {title}
            </h2>
            <div className={`mt-4 h-1 w-24 bg-gradient-to-r from-secondary to-primary rounded-full ${center ? 'mx-auto' : ''}`}></div>
        </div>
    )
}
