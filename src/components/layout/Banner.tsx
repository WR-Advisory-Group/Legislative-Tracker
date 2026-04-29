interface BannerProps {
  title: string;
}

export default function Banner({ title }: BannerProps) {
  return (
    <div className="bg-mb-blue-10 py-10 px-4 sm:px-6 lg:px-20 border-b border-mb-border">
      <h1 className="text-mb-text-dark text-3xl font-bold">{title}</h1>
      <div className="mt-3 w-16 h-0.5 bg-mb-brand rounded-full" />
    </div>
  );
}
