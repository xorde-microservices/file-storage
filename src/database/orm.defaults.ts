import {
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Repository,
	UpdateDateColumn,
	VersionColumn,
} from "typeorm";

/* Get all columns of entity, even unselected ones */
export function getCols<T>(repository: Repository<T>): (keyof T)[] {
	return repository.metadata.columns.map(
		(col) => col.propertyName,
	) as (keyof T)[];
}

@Entity()
export class BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	// https://github.com/typeorm/typeorm/issues/877
	@CreateDateColumn({ type: "timestamp with time zone", select: false })
	created?: Date;
}

@Entity()
export class VersionedEntity extends BaseEntity {
	@UpdateDateColumn({ type: "timestamp with time zone", select: false })
	updated?: Date;

	@VersionColumn({ select: false })
	version?: number;
}

@Entity()
export class ImmutableEntity extends BaseEntity {
	// @see: https://typeorm.io/#/decorator-reference/deletedatecolumn
	@DeleteDateColumn({ type: "timestamp with time zone", select: false })
	deleted?: Date;
}

@Entity()
export class ImmutableVersionedEntity extends VersionedEntity {
	// @see: https://typeorm.io/#/decorator-reference/deletedatecolumn
	@DeleteDateColumn({ type: "timestamp with time zone", select: false })
	deleted?: Date;
}
