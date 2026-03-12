import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-12">

      {/* Header */}
      <div className="mb-12 text-center">
        <span className="text-5xl">☕</span>
        <h1 className="text-4xl font-bold mt-4 text-amber-400">About Random Coffee</h1>
        <p className="text-stone-400 mt-2 text-lg">How it works and why it exists</p>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-8">

        {/* What is it */}
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-3">What is Random Coffee?</h2>
          <p className="text-stone-300 leading-relaxed">
            Random Coffee is a simple tool that helps teams connect across departments.
            Upload a list of participants, hit generate, and the app will randomly pair
            people for a casual coffee meetup. It's a great way to break silos, spark
            new conversations, and build a stronger team culture.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">How It Works</h2>
          <ol className="flex flex-col gap-4">
            {[
              {
                step: '01',
                title: 'Upload your team list',
                desc: 'Prepare a CSV file with three columns: name, email, and department. Upload it on the home page.'
              },
              {
                step: '02',
                title: 'Review participants',
                desc: 'The app parses your file instantly and shows you a preview of all loaded participants.'
              },
              {
                step: '03',
                title: 'Generate pairs',
                desc: 'Hit the Generate button and the app randomly shuffles and pairs everyone up. If there\'s an odd number, one person sits out this round.'
              },
              {
                step: '04',
                title: 'Save your history',
                desc: 'Sign in with Google to save each round\'s pairings. Future rounds will avoid repeating the same pairs.'
              }
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-4 items-start">
                <span className="text-amber-400 font-bold text-lg w-8 shrink-0">{step}</span>
                <div>
                  <p className="font-semibold text-stone-100">{title}</p>
                  <p className="text-stone-400 text-sm mt-1 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CSV format */}
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-3">CSV File Format</h2>
          <p className="text-stone-400 text-sm mb-4">
            Your file must have these exact column headers in the first row:
          </p>
          <div className="bg-stone-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
            <p className="text-amber-400">name,email,department</p>
            <p className="text-stone-400">Anna Svensson,anna@company.com,Engineering</p>
            <p className="text-stone-400">Erik Lindqvist,erik@company.com,Design</p>
            <p className="text-stone-400">Maria Johansson,maria@company.com,Marketing</p>
          </div>
        </div>

        {/* Pairing logic */}
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-3">Pairing Logic</h2>
          <p className="text-stone-300 leading-relaxed mb-3">
            The pairing algorithm shuffles the participant list using a Fisher-Yates-style
            random sort, then pairs people sequentially from the shuffled list. This ensures
            every pairing is statistically random with no bias toward any individual or department.
          </p>
          <p className="text-stone-300 leading-relaxed">
            When signed in, past pairings are saved to your account in Firestore. You can
            regenerate as many times as you like — each round is saved separately so you
            always have a record of who met whom.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-3 px-8 rounded-xl transition-all"
          >
            Start Generating Pairs ☕
          </Link>
        </div>

      </div>
    </div>
  )
}
