import Link from 'next/link'
import { Layout } from '../components/Layout'
import Image from 'next/image'

// Reusable component for Philosophy items
const PhilosophyItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="text-center">
    <div className="mx-auto mb-6 w-14 h-14 bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)] text-[#1ABC9C] dark:text-[#4F46E5] rounded-full flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">{title}</h3>
    <p className="text-[#706C69] dark:text-[#9CA3AF]">{description}</p>
  </div>
);

// Reusable component for Section Headers
const SectionHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="text-center mb-12 mt-24">
    <h2 className="text-4xl md:text-5xl font-extrabold text-[#3A3532] dark:text-[#E5E7EB] mb-4">{title}</h2>
    <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] max-w-2xl mx-auto">{description}</p>
  </div>
);

// Reusable component for Game Cards
const GameCard = ({ tag, title, description, buttonText, buttonHref, isFeatured = false, isExternal = false, comingSoon = false, icon, image }: { tag?: string, title: string, description: string, buttonText: string, buttonHref: string, isFeatured?: boolean, isExternal?: boolean, comingSoon?: boolean, icon?: React.ReactNode, image?: React.ReactNode }) => {
  const cardClasses = "bg-white dark:bg-[#1F2937] border border-[#EAE8E3] dark:border-[#374151] rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
  const buttonClasses = `inline-block text-center font-bold py-4 px-6 rounded-[16px] transition-transform hover:-translate-y-0.5`
  
  const primaryButton = `${buttonClasses} bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white`
  const disabledButton = `${buttonClasses} bg-[#bdc3c7] dark:bg-gray-600 text-white cursor-not-allowed`
  const externalButton = `${buttonClasses} bg-white dark:bg-transparent border border-[#EAE8E3] dark:border-[#374151] text-[#3A3532] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#374151]`

  const renderButton = () => {
    if (comingSoon) {
      return <span className={disabledButton}>{buttonText}</span>
    }
    if (isExternal) {
      return <a href={buttonHref} target="_blank" rel="noopener noreferrer" className={externalButton}>{buttonText}</a>
    }
    return <Link href={buttonHref} className={primaryButton}>{buttonText}</Link>
  }

  if (isFeatured) {
    return (
      <div className={`${cardClasses} md:col-span-full grid md:grid-cols-2 items-center gap-12 !p-0`}>
        <div className="p-4 md:p-6 bg-[#F0F2F5] dark:bg-[#111827] flex items-center justify-center h-full">
          {image}
        </div>
        <div className="p-8 md:p-12 flex flex-col">
          {tag && <span className="self-start bg-[rgba(26,188,156,0.1)] text-[#1ABC9C] dark:text-[#4F46E5] text-sm font-bold rounded-full px-3 py-1 mb-4">{tag}</span>}
          <h3 className="text-3xl font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">{title}</h3>
          <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">{description}</p>
          {renderButton()}
        </div>
      </div>
    )
  }

  if (isExternal) {
    return (
      <div className={cardClasses}>
        <div className="p-8 flex flex-col flex-grow">
          <div className="h-12 mb-4 flex items-center">{icon}</div>
          <h3 className="text-2xl font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">{title}</h3>
          <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">{description}</p>
          {renderButton()}
        </div>
      </div>
    )
  }

  return (
    <div className={cardClasses}>
      <div className="bg-[#F0F2F5] dark:bg-[#111827] aspect-video flex items-center justify-center p-8">
        <div className="w-16 h-16 text-[#1ABC9C] dark:text-[#4F46E5]">{icon}</div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        {tag && <span className={`self-start text-sm font-bold rounded-full px-3 py-1 mb-4 ${comingSoon ? 'bg-[rgba(112,108,105,0.1)] text-[#706C69] dark:text-gray-400' : 'bg-[rgba(26,188,156,0.1)] text-[#1ABC9C] dark:text-[#4F46E5]'}`}>{tag}</span>}
        <h3 className="text-2xl font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">{title}</h3>
        <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">{description}</p>
        {renderButton()}
      </div>
    </div>
  );
};


export default function GamesPage() {
  return (
      <main>
        {/* Hero Section */}
        <section className="text-center py-24 md:py-32">
          <div className="container max-w-6xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-tight tracking-tighter max-w-4xl mx-auto text-[#3A3532] dark:text-[#E5E7EB]">
              Cognitive Training Games
            </h1>
            <p className="text-xl md:text-[1.25rem] max-w-3xl mx-auto mt-6 text-[#706C69] dark:text-[#9CA3AF]">
              Train your mind, not just pass the time. A collection of science-inspired games to strengthen your focus, memory, and mental agility.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="container max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <PhilosophyItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>}
              title="Targeted Training"
              description="Each game is designed to challenge a specific executive function, like working memory or impulse control."
            />
            <PhilosophyItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
              title="Simple & Non-Distracting"
              description="We remove all unnecessary clutter, so you can focus entirely on the cognitive task at hand."
            />
            <PhilosophyItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>}
              title="Measure What Matters"
              description="Get instant feedback on your performance to track your progress and stay motivated over time."
            />
          </div>
        </section>

        {/* In-House Games Section */}
        <section className="container max-w-6xl mx-auto px-6">
          <SectionHeader
            title="Our In-House Games"
            description="Simple, purposeful, and free. Start training in seconds, no sign-ups required."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GameCard
              isFeatured={true}
              tag="Working Memory"
              title="N-Back Training"
              description="A classic cognitive challenge to boost your working memory. The task is simple: identify if the current stimulus matches the one from 'N' steps ago. A powerful mental workout."
              buttonText="Start Training"
              buttonHref="/games/n-back-game"
              image={
                <>
                  <Image
                    src="/images/n-back-tarining.png"
                    alt="N-Back Training"
                    width={360}
                    height={240}
                    className="w-full h-auto object-contain rounded-2xl shadow-lg block dark:hidden"
                    priority
                  />
                  <Image
                    src="/images/n-nack-training-dark.png"
                    alt="N-Back Training Dark"
                    width={360}
                    height={240}
                    className="w-full h-auto object-contain rounded-2xl shadow-lg hidden dark:block"
                    priority
                  />
                </>
              }
            />
            <GameCard
              comingSoon={true}
              tag="Coming Soon"
              title="Impulse Control Game"
              description="Train your brain to pause and think before acting. This Go/No-Go task challenges you to react to specific targets while inhibiting responses to others."
              buttonText="Coming Soon"
              buttonHref="#"
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
            />
            <GameCard
              comingSoon={true}
              tag="Coming Soon"
              title="Task Switching Challenge"
              description="Boost your cognitive flexibility by rapidly switching between different rules and tasks. A great exercise to improve mental agility."
              buttonText="Coming Soon"
              buttonHref="#"
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="8 21 3 21 3 16"></polyline><line x1="15" y1="4" x2="3" y2="16"></line></svg>}
            />
          </div>
        </section>

        {/* Recommended Trainers Section */}
        <section className="container max-w-6xl mx-auto px-6 mb-24">
          <SectionHeader
            title="Recommended Brain Trainers"
            description="Explore other excellent platforms loved by the community for a wider variety of brain training games."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GameCard
              isExternal={true}
              title="Lumosity"
              description="A popular platform with a wide variety of games targeting memory, attention, problem-solving, and more. Great for daily, varied workouts."
              buttonText="Visit Lumosity"
              buttonHref="https://www.lumosity.com"
              icon={<div className="text-[#4A90E2]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>}
            />
            <GameCard
              isExternal={true}
              title="CogniFit"
              description="Offers scientifically validated brain games and cognitive tests. Often used in research, it provides detailed analysis of your cognitive state."
              buttonText="Visit CogniFit"
              buttonHref="https://www.cognifit.com"
              icon={<div className="text-[#8E44AD]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 18L12 12L16 14"/></svg></div>}
            />
            <GameCard
              isExternal={true}
              title="Human Benchmark"
              description="A collection of simple, fast tests for reaction time, memory, and other cognitive skills. Fun for quick challenges and comparing your scores."
              buttonText="Visit Human Benchmark"
              buttonHref="https://humanbenchmark.com/"
              icon={<div className="text-[#34495E]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg></div>}
            />
          </div>
        </section>
      </main>
  )
} 