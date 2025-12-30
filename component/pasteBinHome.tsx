"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Clock, Eye, Share2, FileText } from "lucide-react";
import * as PasteService from "@/service/pasteServices";

export default function PastebinHome() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [createdPaste, setCreatedPaste] = useState<{ id: string; url: string } | null>(null);

  const handleCreatePaste = async () => {
    if (!content.trim()) {
      toast.error("Content is required", {
        description: "Please enter some text to create a paste"
      });
      return;
    }

    setLoading(true);
    try {
      const pasteData: PasteService.CreatePasteData = {
        content: content.trim(),
      };

      if (ttlSeconds && parseInt(ttlSeconds) > 0) {
        pasteData.ttl_seconds = parseInt(ttlSeconds);
      }

      if (maxViews && parseInt(maxViews) > 0) {
        pasteData.max_views = parseInt(maxViews);
      }

      const response = await PasteService.createPaste(pasteData);
      setCreatedPaste(response);
      
      toast.success("Paste created successfully!", {
        description: "Your shareable link is ready"
      });
    } catch (error: any) {
      console.error("Error creating paste:", error);
      toast.error("Failed to create paste", {
        description: error?.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (createdPaste) {
      navigator.clipboard.writeText(createdPaste.url);
      toast.success("Link copied!", {
        description: "Paste URL copied to clipboard"
      });
    }
  };

  const handleReset = () => {
    setContent("");
    setTtlSeconds("");
    setMaxViews("");
    setCreatedPaste(null);
  };

  const getTtlDescription = () => {
    if (!ttlSeconds || parseInt(ttlSeconds) <= 0) return null;
    const seconds = parseInt(ttlSeconds);
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FileText className="h-10 w-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Pastebin-Lite</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Share text snippets with optional expiry and view limits
          </p>
        </div>

        {!createdPaste ? (
          <Card className="shadow-xl border-2 border-indigo-100">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="text-2xl text-gray-800">Create New Paste</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-semibold text-gray-700">
                  Paste Content *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Enter your text here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm resize-none border-2 focus:border-indigo-400"
                />
                <p className="text-sm text-gray-500">
                  {content.length} characters
                </p>
              </div>

              {/* Optional Constraints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                {/* TTL */}
                <div className="space-y-2">
                  <Label htmlFor="ttl" className="flex items-center gap-2 text-base font-semibold text-gray-700">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    Time to Live (optional)
                  </Label>
                  <Input
                    id="ttl"
                    type="number"
                    placeholder="Seconds"
                    value={ttlSeconds}
                    onChange={(e) => setTtlSeconds(e.target.value)}
                    min="1"
                    className="border-2 focus:border-indigo-400"
                  />
                  {getTtlDescription() && (
                    <p className="text-sm text-indigo-600 font-medium">
                      Expires in: {getTtlDescription()}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    How long until the paste expires
                  </p>
                </div>

                {/* Max Views */}
                <div className="space-y-2">
                  <Label htmlFor="maxViews" className="flex items-center gap-2 text-base font-semibold text-gray-700">
                    <Eye className="h-4 w-4 text-indigo-600" />
                    Max Views (optional)
                  </Label>
                  <Input
                    id="maxViews"
                    type="number"
                    placeholder="Number of views"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    min="1"
                    className="border-2 focus:border-indigo-400"
                  />
                  <p className="text-xs text-gray-500">
                    Maximum number of times this paste can be viewed
                  </p>
                </div>
              </div>

              {/* Create Button */}
              <div className="pt-4">
                <Button
                  onClick={handleCreatePaste}
                  disabled={loading || !content.trim()}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                  size="lg"
                >
                  {loading ? "Creating..." : "Create Paste"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-2 border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                <Share2 className="h-6 w-6 text-green-600" />
                Paste Created Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Paste URL */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">
                  Shareable Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={createdPaste.url}
                    readOnly
                    className="font-mono text-sm bg-gray-50 border-2"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="border-2 border-indigo-200 hover:bg-indigo-50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>

              {/* Paste ID */}
              <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-sm font-semibold text-gray-700">
                  Paste ID
                </Label>
                <p className="font-mono text-lg font-bold text-indigo-700">
                  {createdPaste.id}
                </p>
              </div>

              {/* Info Message */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Save this link! Once you leave this page, you'll need the URL to access your paste.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => window.open(createdPaste.url, "_blank")}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Paste
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                >
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-blue-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">Time-Based Expiry</h3>
              <p className="text-sm text-gray-600">Set an expiration time for your pastes</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">View Limits</h3>
              <p className="text-sm text-gray-600">Restrict how many times a paste can be viewed</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Share2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">Easy Sharing</h3>
              <p className="text-sm text-gray-600">Get a shareable link instantly</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}