import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export interface NavigationItem {
  name: string
  href: string
  current: boolean
}

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation({ navigation }: { navigation: NavigationItem[] }) {
  return (
    <Disclosure as="nav" className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link href="/" className="text-green-800 text-lg font-bold">
                <strong>WTS</strong>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current
                        ? 'bg-green-100 text-green-800 font-semibold'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-800',
                      'rounded-md px-3 py-2 text-sm font-medium transition'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-700 hover:bg-green-50 hover:text-green-800 focus:ring-2 focus:ring-green-200 focus:ring-offset-2 focus:outline-none">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current
                  ? 'bg-green-100 text-green-800 font-semibold'
                  : 'text-gray-700 hover:bg-green-50 hover:text-green-800',
                'block rounded-md px-3 py-2 text-base font-medium transition'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}