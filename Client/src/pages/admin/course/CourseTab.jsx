import LoadingSpinner from "@/components/LoadingSpinner";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    useDeleteCourseMutation,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    usePublishCourseMutation,
} from "@/features/api/courseApi";

import { Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CourseTab = () => {

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });

    const [deleteCourse] = useDeleteCourseMutation();

    const handleDelete = async () => {
        if (!confirm("This action cannot be undone. This will permanently delete the course, including all lectures and videos. Are you sure you want to proceed?")) {
            return;
        }

        try {
            const res = await deleteCourse(course._id).unwrap();
            toast.success(res.message || "Course deleted successfully");
        } catch (err) {
            toast.error(err.data?.message || "Failed to delete course");
        }
    };

    const params = useParams();
    const courseId = params.courseId;
    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } =
        useGetCourseByIdQuery(courseId);

    const [publishCourse, { }] = usePublishCourseMutation();

    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "",
            });
        }
    }, [courseByIdData]);

    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const navigate = useNavigate();

    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    };
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    };
    // get file
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };

    const updateCourseHandler = async () => {
        console.log(input);

        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);

        await editCourse({ formData, courseId });
    };

    const publishStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action });
            if (response.data) {
                refetch();
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to publish or unpublish course");
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course update.");
        }
        if (error) {
            toast.error(error.data.message || "Failed to update course");
        }
    }, [isSuccess, error]);

    if (courseByIdLoading) return <LoadingSpinner />;
    // const isPublished = false;
    return (
        <Card className="w-full bg-white dark:bg-gray-700">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <CardTitle className="text-lg md:text-xl">Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your course here. Click save when you're done.
                    </CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        disabled={courseByIdData?.course.lectures.length === 0}
                        variant="outline"
                        onClick={() =>
                            publishStatusHandler(
                                courseByIdData?.course.isPublished ? "false" : "true"
                            )
                        }
                    >
                        {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
                    </Button>

                    <Button variant="destructive" onClick={handleDelete}
                        className="bg-red-500 dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-600">
                        <Trash2 /> Delete Course</Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">

                    {/* Title */}
                    <div className="space-y-1">
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Fullstack developer"
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1">
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a Fullstack developer from zero to hero"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>

                    {/* 4 Inputs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                        {/* Category */}
                        <div className="space-y-1">
                            <Label>Category</Label>
                            <Select value={input.category} onValueChange={selectCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                        <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                                        <SelectItem value="MERN Stack Development">MERN Stack</SelectItem>
                                        <SelectItem value="Java Programming">Java Programming</SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Course Level */}
                        <div className="space-y-1">
                            <Label>Course Level</Label>
                            <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                            <Label>Price (₹)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="199"
                            />
                        </div>

                        {/* Thumbnail */}
                        <div className="space-y-1">
                            <Label>Course Thumbnail</Label>
                            <Input
                                type="file"
                                onChange={selectThumbnail}
                                accept="image/*"
                            />
                        </div>

                    </div>

                    {/* Thumbnail Preview */}
                    {previewThumbnail && (
                        <img
                            src={previewThumbnail}
                            className="h-40 w-auto rounded-md border my-3"
                            alt="Course Thumbnail"
                        />
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={() => history.back()} variant="destructive" className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

};

export default CourseTab;
