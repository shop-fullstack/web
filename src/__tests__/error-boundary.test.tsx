import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GlobalError from "@/app/error";

// Mock next/link
jest.mock("next/link", () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  }
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("GlobalError (error.tsx)", () => {
  const mockReset = jest.fn();
  const mockError = new Error("테스트 에러");

  beforeEach(() => {
    mockReset.mockClear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("에러 메시지와 버튼들을 렌더링한다", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByText("문제가 발생했습니다")).toBeInTheDocument();
    expect(screen.getByText("다시 시도")).toBeInTheDocument();
    expect(screen.getByText("홈으로")).toBeInTheDocument();
  });

  it('"다시 시도" 버튼 클릭 시 reset을 호출한다', async () => {
    const user = userEvent.setup();
    render(<GlobalError error={mockError} reset={mockReset} />);

    await user.click(screen.getByText("다시 시도"));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('"홈으로" 링크가 /를 가리킨다', () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    const homeLink = screen.getByText("홈으로").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("에러를 콘솔에 출력한다", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(console.error).toHaveBeenCalledWith("Unhandled error:", mockError);
  });
});
