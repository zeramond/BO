import Image from "next/image";

type Offering = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
};

const offerings: Offering[] = [
  {
    eyebrow: "THE LANES",
    title: "Eight Lanes, Lit for the Night",
    copy: "Premium Brunswick lanes under shifting color, built for serious games and easy ones in the same breath.",
    image: "/images/lanes_wide3.jpg",
    imageAlt: "Bowling lanes lit in pink and purple",
  },
  {
    eyebrow: "THE TABLE",
    title: "Billiards, After Dark",
    copy: "Two tables, low light, and the kind of room where a quick game turns into the whole evening.",
    image: "/images/billiards2.jpg",
    imageAlt: "Billiards tables beneath a neon Billiards sign",
  },
  {
    eyebrow: "THE BAR",
    title: "Coffee, Cocktails, and a Seat to Watch It All",
    copy: "A bar built for between-frame drinks and full-length matches on the big screen, whichever the night calls for.",
    image: "/images/coffee1.jpg",
    imageAlt: "Espresso bar with steam rising",
  },
];

export default function Experience() {
  return (
    <section className="bg-[#090909] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        <p className="mb-4 text-sm uppercase tracking-[0.5em] text-gray-500">
          The Experience
        </p>
        <h2 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
          Three Rooms.
          <br />
          One Night Out.
        </h2>
      </div>

      <div className="mt-20 flex flex-col gap-24 md:mt-28 md:gap-32">
        {offerings.map((item, index) => {
          const imageFirst = index % 2 === 0;

          return (
            <div
              key={item.eyebrow}
              className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-8 md:grid-cols-2 md:gap-16"
            >
              <div
                className={`relative h-[320px] w-full overflow-hidden rounded-sm md:h-[480px] ${
                  imageFirst ? "md:order-1" : "md:order-2"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className={imageFirst ? "md:order-2" : "md:order-1"}>
                <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#e8197a]">
                  {item.eyebrow}
                </p>
                <h3 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-6 max-w-md text-base leading-7 text-gray-400 md:text-lg">
                  {item.copy}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}