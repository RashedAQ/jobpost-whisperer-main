import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface JobSubmissionFormProps {}

const JobSubmissionForm = ({}: JobSubmissionFormProps) => {
  const [jobText, setJobText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobText.trim()) {
      setError("Please enter a job post");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch("https://rashedbnq.app.n8n.cloud/webhook-test/36fcf7f4-58aa-431e-8c15-fe0eeb80c6b6", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobText: jobText
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit job post");
      }

      setShowSuccess(true);
      setJobText("");
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError("Failed to submit job post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-card shadow-medium border-0 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI Job Email Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Paste your job post below and let AI generate a personalized email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="jobText" className="text-sm font-medium text-foreground block">
              Job Post Content
            </label>
            <Textarea
              id="jobText"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the job post content here..."
              className="min-h-[200px] resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !jobText.trim()}
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-6 shadow-soft transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                Generating Email...
              </div>
            ) : (
              "Generate Email"
            )}
          </Button>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center transition-all duration-300 animate-in slide-in-from-bottom">
              <div className="text-green-600 font-medium">
                ✅ Job post submitted to AI agent!
              </div>
              <div className="text-green-500 text-sm mt-1">
                Your personalized email is being generated
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            Powered by AI • Generate professional emails in seconds
          </p>
        </div>
      </Card>
    </div>
  );
};

export default JobSubmissionForm;