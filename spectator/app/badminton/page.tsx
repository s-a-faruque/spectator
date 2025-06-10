import Header from './components/Header'
import Navigation from './components/Navigation'

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team & Groups', href: '#', current: false },
  { name: 'Matches', href: '#', current: false },
]

export default function Example() {
  return (
    <>
      <div className="min-h-full">
        <Navigation navigation={navigation} />
        <Header title="Tournament Dashboard" />
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{/* Your content */}Hi</div>
        </main>
      </div>
    </>
  )
}
