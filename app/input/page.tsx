import BirthForm from "@/components/BirthForm";
import StepNavigation from "@/components/StepNavigation";

export default function InputPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <StepNavigation step="input" />
      <div className="mx-auto max-w-lg">
        <h1 className="text-on-bg mb-2 text-2xl">나의 사주를 알려주세요</h1>
        <p className="text-on-bg-muted mb-8 text-sm">
          정확한 출생정보를 입력하면 사주 원국을 계산합니다.
        </p>
        <div className="card">
          <BirthForm />
        </div>
      </div>
    </div>
  );
}
