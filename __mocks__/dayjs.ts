import { Dayjs } from 'dayjs'

type MockedDayjsInstance = {
  format: jest.Mock<string, []>
  add: jest.Mock<MockedDayjsInstance, [number, string?]>
  subtract: jest.Mock<MockedDayjsInstance, [number, string?]>
  isBefore: jest.Mock<boolean, [Dayjs | string | Date | number]>
  isAfter: jest.Mock<boolean, [Dayjs | string | Date | number]>
  isSame: jest.Mock<boolean, [Dayjs | string | Date | number]>
  valueOf: jest.Mock<number, []>
  toDate: jest.Mock<Date, []>
  toString: jest.Mock<string, []>
}

type MockedDayjs = {
  (): MockedDayjsInstance
  extend: jest.Mock
  locale: jest.Mock
}

const mockedDayjs: MockedDayjs = Object.assign(
  jest.fn<MockedDayjsInstance, []>(() => ({
    format: jest.fn<string, []>(() => '2023-01-01'),
    add: jest.fn<MockedDayjsInstance, [number, string?]>(() => mockedDayjs()),
    subtract: jest.fn<MockedDayjsInstance, [number, string?]>(() => mockedDayjs()),
    isBefore: jest.fn<boolean, [Dayjs | string | Date | number]>(() => false),
    isAfter: jest.fn<boolean, [Dayjs | string | Date | number]>(() => true),
    isSame: jest.fn<boolean, [Dayjs | string | Date | number]>(() => false),
    valueOf: jest.fn<number, []>(() => 1672531200000),
    toDate: jest.fn<Date, []>(() => new Date('2023-01-01')),
    toString: jest.fn<string, []>(() => '2023-01-01'),
  })),
  {
    extend: jest.fn(),
    locale: jest.fn(),
  },
)

export default mockedDayjs
