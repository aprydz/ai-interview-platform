import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { assessmentsApi } from "@/services/assessments";
import { Plus, Clock, ChevronRight } from "lucide-react";
import type { Assessment } from "@/types";

function SessionSummary({ session }: { session?: Assessment["latest_session"] }) {
  if (!session) return null;

  if (session.status === "active")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Live Now
      </span>
    );

  if (session.status === "ended" && session.end_reason === "error")
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
        Gagal
      </span>
    );

  if (session.status === "ended")
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        Selesai
      </span>
    );

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      Menunggu Kandidat
    </span>
  );
}

export default function AssessmentListPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    assessmentsApi
      .list()
      .then((res) => setAssessments(res.data.assessments))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daftar Asesmen</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola instrumen wawancara AI dan pantau sesi kandidat secara real-time.
          </p>
        </div>
        <Button
          onClick={() => navigate("/assessments/new")}
          className="gradient-teal text-white shadow-sm hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Buat Asesmen Baru
        </Button>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50/60 rounded-xl p-4 text-sm text-red-600">
          Gagal memuat data asesmen. Silakan refresh halaman atau coba sesaat lagi.
        </div>
      )}

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl bg-slate-200/60" />
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-slate-800 text-base mb-1">Belum Ada Asesmen</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
            Mulai dengan membuat instrumen asesmen wawancara AI pertama Anda untuk mengevaluasi kandidat.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/assessments/new")}
            className="hover:border-[#01959f] hover:text-[#01959f]"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Buat Asesmen Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {assessments.map((a) => (
            <Card
              key={a.id}
              className="group cursor-pointer bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-[#01959f]/40 hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden"
              onClick={() => navigate(`/assessments/${a.id}/invite`)}
            >
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-900 group-hover:text-[#01959f] transition-colors text-base">
                    {a.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {a.time_limit_min} menit
                    </span>
                    {a.latest_session && (
                      <SessionSummary session={a.latest_session} />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-[#01959f] group-hover:translate-x-1 transition-all duration-200">
                  <span className="text-xs font-medium hidden sm:inline">Lihat Detail</span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
