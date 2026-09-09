"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { updateProfileLocally } from "@/redux/features/profile/profile.slice";
import { formatDate } from "@/utils/formatDate";
import { AlertCircle, Camera, Clock, Loader2, Mail, Pencil, Settings } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ProfileDataType } from "../types/types";

export function ProfileHeader({ data }: { data: ProfileDataType }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<ProfileDataType>(data);
  const [previewImage, setPreviewImage] = useState(data.image || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    setProfile(data);
    setPreviewImage(data.image || "");
  }, [data]);

  useEffect(() => {
    dispatch(
      updateProfileLocally({
        name: profile.name,
        email: profile.email,
        createdAt: profile.createdAt,
        image: previewImage,
        bio: profile.bio ?? null,
        settings: profile.settings,
      }),
    );
  }, [dispatch, previewImage, profile]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", profile.name.trim());
      formData.append("email", profile.email.trim());
      formData.append("bio", profile.bio || "");

      if (uploadedFile) {
        formData.append("image", uploadedFile);
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update profile");
      }

      const updatedProfile = result.data as ProfileDataType;
      setProfile(updatedProfile);
      setPreviewImage(updatedProfile.image || "");
      setUploadedFile(null);
      setIsEditing(false);
      setFeedback({
        type: "success",
        message: result.message || "Profile updated successfully",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving your profile.",
      });
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-32 bg-linear-to-r from-primary/20 via-primary/10 to-primary/5" />
      <div className="px-6 pb-6 relative">
        <div className="absolute -top-12 left-6">
          <div className="w-24 h-24 rounded-2xl border-4 border-card bg-muted overflow-hidden shadow-lg">
            {previewImage ? (
              <img
                src={previewImage}
                alt={profile.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary/40">U</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-14 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{profile.name || "User"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              @{profile.name?.split(" ").join("").toLowerCase() || "user"}
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg">
              {profile.bio ||
                "Building the future of form management. Passionate about clean UI and great user experiences."}
            </p>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
              {profile.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {profile.email}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDate(profile.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing((current) => !current);
                setFeedback(null);
              }}
              className="h-9 px-4 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
            >
              <Pencil size={14} />
              {isEditing ? "Close" : "Edit Profile"}
            </button>
            <Link
              href="/settings"
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <Settings size={14} />
              Settings
            </Link>
          </div>
        </div>

        {feedback && (
          <div className="mt-5">
            <Alert
              variant={feedback.type === "error" ? "destructive" : "default"}
              className="border-border"
            >
              {feedback.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              <AlertTitle>
                {feedback.type === "error" ? "Unable to save" : "Profile updated"}
              </AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          </div>
        )}

        {isEditing && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl border border-border bg-background/60 p-5"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Edit profile</h2>
                <p className="text-sm text-muted-foreground">
                  Update your public profile information.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[140px_1fr]">
              <div className="flex flex-col items-center gap-3">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-muted w-32 h-32">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-3xl font-bold text-primary/40">
                      U
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-3.5 w-3.5" />
                  Change Photo
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full name</Label>
                    <Input
                      id="profile-name"
                      value={profile.name}
                      onChange={(event) =>
                        setProfile((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={profile.email}
                      onChange={(event) =>
                        setProfile((current) => ({ ...current, email: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <Textarea
                    id="profile-bio"
                    rows={4}
                    value={profile.bio || ""}
                    onChange={(event) =>
                      setProfile((current) => ({ ...current, bio: event.target.value }))
                    }
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => {
                      setIsEditing(false);
                      setUploadedFile(null);
                      setPreviewImage(data.image || "");
                      setFeedback(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="rounded-xl" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
