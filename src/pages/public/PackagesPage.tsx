import { usePackages } from "../../hooks/usePackages";
import PackageCard from "../../components/packages/PackageCard";
import ComparisonTable from "../../components/packages/ComparisonTable";
import { Skeleton } from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";

// /packages – שתי החבילות + טבלת השוואה. פתוח לכולם
function PackagesPage() {
  const { data: packages, isPending, isError, error, refetch } = usePackages();

  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="font-display text-5xl font-extrabold md:text-7xl">PACKAGES</h1>
        <p className="bg-gradient-to-l from-berry to-rose bg-clip-text font-display text-5xl font-extrabold text-transparent md:text-7xl">MOMENTS</p>
        <p className="mt-4 text-muted">שתי חבילות. אפשר לבחור עוד לפני שקובעים תאריך לצילום.</p>
      </header>

      {isPending ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[32rem]" />
          <Skeleton className="h-[32rem]" />
        </div>
      ) : isError ? (
        <ErrorMessage error={error} onRetry={() => refetch()} />
      ) : (
        <>
          {/* showFeatures – הגרסה המלאה של הכרטיס: רשימת "מה כלול" + "בחירה והרשמה" */}
          <div className="grid gap-6 md:grid-cols-2">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} showFeatures />
            ))}
          </div>

          <section>
            <h2 className="mb-6 text-3xl font-extrabold">השוואה במבט אחד</h2>
            <ComparisonTable packages={packages} />
          </section>
        </>
      )}
    </div>
  );
}

export default PackagesPage;
